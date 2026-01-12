import mongoose, { Connection } from "mongoose";
import * as dotenv from "dotenv";
import { dbConnection } from "../../../dbConnection";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { NotificationModel } from "../../../models/notification";
import { createBusinessNotification } from "../helpers/helpers";
import { testMongoDBQuery } from "./NotificationQuery";


dotenv.config();

describe('Notification Query', () => {
    const db = dbConnection();

    afterAll(async () => {
        await db.close(); 
    });


    it('should create, retrieve and delete a notification', async () => { 
        
        const businessId = '655aaa845b81650a0dc2b6f2';  
        await createBusinessNotification({
        message: "This is a test payment",
        businessId: businessId,
        sender_id: businessId,
        path: "business/123"
        });

        const foundNotification = await NotificationModel(db)
            .findOne({ message: "This is a test payment" });

        expect(foundNotification).toBeTruthy();
        
        expect(foundNotification?.message).toBeTruthy();
        expect(foundNotification?.path).toBeTruthy();
        expect(foundNotification?.isRead === false).toBeTruthy();
        expect(foundNotification?.business_receiver_id).toBeTruthy();
        expect(foundNotification?.sender_id).toBeTruthy();
        expect(foundNotification?.created_date).toBeTruthy();

        const deletedNotification = await NotificationModel(db).deleteOne({ message: "This is a test payment" });

        // change to test the delete notification route once it is written
        expect(deletedNotification).toStrictEqual({ acknowledged: true, deletedCount: 1 });

    });

    it('test notification test function', async () => {
        const businessId = '655aaa845b81650a0dc2b6f2';  
        const response = await testMongoDBQuery(businessId)
        expect(response.length).toBe(2);

        })

    })



