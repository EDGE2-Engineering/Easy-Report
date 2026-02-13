/**
 * Frontend-Only DynamoDB Reports API
 * Interacts directly with DynamoDB using temporary credentials
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    QueryCommand,
    PutCommand,
    DeleteCommand,
    GetCommand
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

export const dynamoReportsApi = {
    /**
     * List all reports directly from DynamoDB
     * @param {string} idToken - Cognito ID Token
     */
    async listReports(idToken) {
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
                    ":type": "report"
                }
            });

            const response = await docClient.send(command);
            return response.Items || [];
        } catch (error) {
            console.error("DynamoDB listReports error:", error);
            throw error;
        }
    },

    async getReport(reportId, idToken) {
        try {
            const docClient = getDocClient(idToken);
            const command = new GetCommand({
                TableName: TABLE_NAME,
                Key: { id: reportId }
            });

            const response = await docClient.send(command);
            return response.Item;
        } catch (error) {
            console.error("DynamoDB getReport error:", error);
            throw error;
        }
    },

    /**
     * Finds a report by its custom reportId field using the TypeIndex GSI
     * This is useful for catching duplicates if the primary "id" is a UUID
     */
    async getReportByReportId(reportId, idToken) {
        try {
            const docClient = getDocClient(idToken);
            const command = new QueryCommand({
                TableName: TABLE_NAME,
                IndexName: "TypeIndex",
                KeyConditionExpression: "#type = :type",
                FilterExpression: "reportId = :reportId",
                ExpressionAttributeNames: {
                    "#type": "type"
                },
                ExpressionAttributeValues: {
                    ":type": "report",
                    ":reportId": reportId
                }
            });

            const response = await docClient.send(command);
            return response.Items?.[0] || null;
        } catch (error) {
            console.error("DynamoDB getReportByReportId error:", error);
            throw error;
        }
    },

    async createReport(reportData, idToken) {
        try {
            const docClient = getDocClient(idToken);
            // Use reportId from form as the primary key ID
            const reportId = reportData.reportId;
            if (!reportId) throw new Error("Report ID is required");

            const reportType = 'report';

            const reportItem = {
                ...reportData,
                id: reportId,
                type: reportType,
                updated_at: new Date().toISOString()
            };

            // If we're performing an overwrite/migration where the primary ID is changing 
            // (e.g. from a UUID to the reportId itself), delete the old record first
            if (reportData.id && reportData.id !== reportId) {
                try {
                    await this.deleteReport(reportData.id, idToken);
                } catch (e) {
                    console.warn("Could not delete legacy report record during migration:", e);
                }
            }

            // Check if it already exists to preserve created_at
            const existing = await this.getReport(reportId, idToken);
            if (existing && existing.created_at) {
                reportItem.created_at = existing.created_at;
            } else {
                reportItem.created_at = new Date().toISOString();
            }

            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: reportItem
            });

            await docClient.send(command);
            return reportItem;
        } catch (error) {
            console.error("DynamoDB createReport error:", error);
            throw error;
        }
    },

    /**
     * Delete a report directly from DynamoDB
     * @param {string} reportId - The ID of the report to delete
     * @param {string} idToken - Cognito ID Token
     */
    async deleteReport(reportId, idToken) {
        try {
            const docClient = getDocClient(idToken);
            const command = new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id: reportId }
            });

            await docClient.send(command);
            return true;
        } catch (error) {
            console.error("DynamoDB deleteReport error:", error);
            throw error;
        }
    }
};

export default dynamoReportsApi;
