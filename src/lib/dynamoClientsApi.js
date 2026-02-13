/**
 * Frontend-Only DynamoDB Clients API
 * Interacts directly with DynamoDB using temporary credentials
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    QueryCommand,
    PutCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";
import { cognitoConfig } from "@/config";
import { getFrontendCredentials } from "@/lib/dynamoAuth";

const TABLE_NAME = "EDGE2Data";

/**
 * Creates a DynamoDB Document Client with fresh temporary credentials
 * @param {string} idToken - The Cognito ID Token
 */
const getDocClient = (idToken) => {
    const credentials = getFrontendCredentials(idToken);

    const client = new DynamoDBClient({
        region: cognitoConfig.region,
        credentials
    });

    return DynamoDBDocumentClient.from(client);
};

export const dynamoClientsApi = {
    /**
     * List all clients directly from DynamoDB
     * @param {string} idToken - Cognito ID Token
     */
    async listClients(idToken) {
        try {
            const docClient = getDocClient(idToken);
            const command = new QueryCommand({
                TableName: TABLE_NAME,
                IndexName: "TypeIndex",
                KeyConditionExpression: "#type = :type",
                ExpressionAttributeNames: {
                    "#type": "type"
                },
                ExpressionAttributeValues: {
                    ":type": "client"
                }
            });

            const response = await docClient.send(command);
            return response.Items || [];
        } catch (error) {
            console.error("DynamoDB listClients error:", error);
            throw error;
        }
    },

    /**
     * Create/Update a client directly in DynamoDB
     * @param {Object} formData - Client data
     * @param {string} idToken - Cognito ID Token
     */
    async createClient(formData, idToken) {
        try {
            const docClient = getDocClient(idToken);
            const newClient = {
                id: crypto.randomUUID(),
                type: 'client',
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: newClient
            });

            await docClient.send(command);
            return newClient;
        } catch (error) {
            console.error("DynamoDB createClient error:", error);
            throw error;
        }
    },

    async updateClient(clientId, formData, idToken) {
        try {
            const docClient = getDocClient(idToken);

            // Note: We need to preserve the ID but we update other fields
            const updatedClient = {
                ...formData,
                id: clientId,
                type: 'client',
                updated_at: new Date().toISOString()
            };

            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: updatedClient
            });

            await docClient.send(command);
            return updatedClient;
        } catch (error) {
            console.error("DynamoDB updateClient error:", error);
            throw error;
        }
    },

    /**
     * Delete a client directly from DynamoDB
     * @param {string} clientId - The ID of the client to delete
     * @param {string} idToken - Cognito ID Token
     */
    async deleteClient(clientId, idToken) {
        try {
            const docClient = getDocClient(idToken);
            const command = new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id: clientId }
            });

            await docClient.send(command);
            return true;
        } catch (error) {
            console.error("DynamoDB deleteClient error:", error);
            throw error;
        }
    }
};

export default dynamoClientsApi;
