import mongoose, { Connection } from "mongoose";
import * as dotenv from "dotenv";
import { dbConnection } from "../../../dbConnection";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";
import { NotificationModel } from "../../../models/notification";

dotenv.config();

describe('Notification Query', () => {
    const db = dbConnection();

  beforeAll(async () => {
  });

  afterAll(async () => {
    await db.close(); 
  });

  it('should return notifications for a valid business ID', async () => {
    const businessId = '655aaa845b81650a0dc2b6f2'; // Replace with actual business ID for testing

    const foundNotifications = await NotificationModel(db)
      .find({ business_receiver_id: businessId });
    console.log('********', foundNotifications)
    expect(foundNotifications).toBeTruthy(); // Check if notifications are returned
  });

  it('should throw an error for an invalid business ID', async () => {
    const invalidBusinessId = '655aaa845b81650a0dc2b6f9';

    
      const response = await NotificationModel(db)
        .findOne({ business_receiver_id: invalidBusinessId });
        console.log(response);

    expect(response).toBeNull()

      
  });
});
