import { Address, AddressModel } from "../../../models/address"
import { Connection } from "mongoose"

const getAddressFromBusiness = async (
    parent: any,
    _args: any,
    { db }: { db: Connection },
) => {
    // from the business we will populate the address field and return the address object

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



const createAddress = (parent: any, { input }: { input: Address }, { db }: { db: Connection }) => {
    const Address = AddressModel(db)
    const address = new Address({
        zipcode: input.zipcode,
        city: input.city,
        streetName: input.streetName,
        streetNumber: input.streetNumber,
    })

    return address.save()
}

const AddressResolverMutation = {
    createAddress,
    updateAddress,
}
const AddressResolverQuery = {
    getAddress
}

const AddressResolver = {
    getAddressFromBusiness
}

export {
    AddressResolverMutation,
    AddressResolverQuery,
    AddressResolver
}

