import { AddressModel } from "../../../models/address"
import { Connection } from "mongoose"
import axios from 'axios';
import { MutationResolvers, QueryResolvers } from "../../../generated/graphql";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { UserModel } from "../../../models";

const validateGoogle = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.GOOGLE_MAPS_API}`
const autocompleteGoogleUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json"

const getAddressFromBusiness = async (
    parent: any,
    _args: any,
    { db }: { db: Connection },
) => {
    return await AddressModel(db).findById(parent.address)
}

const getAddress = async (parent: any,
    { id, ...restArgs }: { id: string },
    { db }: { db: Connection }) => {

    return await AddressModel(db).findById(id)
}

const updateAddress = async (parent: any, { input }: { input: any }, { db }: { db: Connection }) => {
    return await AddressModel(db).findByIdAndUpdate(input.id,
        input, { new: true }
    )
}

type GLocation = {
    place_id: string;
    description: string;
}

const getGoogleAutoComplete: QueryResolvers["getGoogleAutoComplete"] = async (parent, { input: { text } }, { client, locale }) => {
    if (!client) throw ApolloError(new Error("No customer"), "Unauthorized")

    if (text.length < 4) throw ApolloError(new Error("Provide 5 chars or more"), "BadRequest")

    try {
        const { data } = await axios.get(
            autocompleteGoogleUrl, {
            params: {
                input: text,
                radius: "500",
                fields: ["address_components", "geometry", "name"],
                key: process.env.GOOGLE_MAPS_API,
                language: locale,
                types: ["address", "postal_code"]
            },
            paramsSerializer: { indexes: null },
        });

        return data.predictions.map((local: GLocation) => {
            return {
                place_id: local.place_id,
                description: local.description
            }
        })
    } catch (e) {
        throw ApolloError(e as Error, "InternalServerError")
    }
}

const createCustomerAddress: MutationResolvers["createCustomerAddress"] = async (parent,
    { input: { streetAddress, complement } }, { db, client }) => {

    if (!client) throw ApolloError(new Error("No customer"), "Unauthorized")

    const { data } = await axios.post(validateGoogle, {
        address: {
            addressLines: [streetAddress]
        }
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })

    const address = await AddressModel(db).create({
        streetAddress: data?.result.address?.postalAddress.addressLines[0] || data?.result.address?.formattedAddress,
        complement: complement,
        postalCode: data?.result.address?.postalAddress.postalCode,
        stateOrProvince: data?.result.address?.postalAddress.administrativeArea,
        city: data?.result.address?.postalAddress.locality,
        country: data?.result.address?.postalAddress.regionCode,
    })
    console.log(address)
    await UserModel(db).findByIdAndUpdate(client._id, {
        address: address._id
    })

    return address.save()
}

const AddressResolverMutation = {
    createCustomerAddress,
    updateAddress,
}
const AddressResolverQuery = {
    getAddress,
    getGoogleAutoComplete
}

const AddressResolver = {
    getAddressFromBusiness
}

export {
    AddressResolverMutation,
    AddressResolverQuery,
    AddressResolver
}

