#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { GumroadClient } from './gumroad-client.js';

// Configuration schema - automatically detected by Smithery
export const configSchema = z.object({
  gumroadAccessToken: z.string().describe("Your Gumroad API access token from https://gumroad.com/api"),
});

export default function createServer({
  config
}: {
  config: z.infer<typeof configSchema>
}) {
  // Create MCP server
  const server = new McpServer({
    name: "gumroad-mcp",
    version: "1.0.0"
  });

  // Initialize Gumroad client with provided access token
  const gumroad = new GumroadClient({
    accessToken: config.gumroadAccessToken,
  });

  // Register get_subscribers tool
  server.tool(
    "get_subscribers",
    "Get all subscribers for a specific Gumroad product",
    {
      product_id: z.string().describe("The Gumroad product ID"),
    },
    async ({ product_id }) => {
      try {
        const subscribers = await gumroad.getSubscribers(product_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(subscribers, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get subscribers: ${errorMessage}`);
      }
    }
  );

  // Register get_subscriber tool
  server.tool(
    "get_subscriber",
    "Get details for a specific subscriber",
    {
      subscriber_id: z.string().describe("The subscriber ID"),
    },
    async ({ subscriber_id }) => {
      try {
        const subscriber = await gumroad.getSubscriber(subscriber_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(subscriber, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get subscriber: ${errorMessage}`);
      }
    }
  );

  // Register get_sales tool
  server.tool(
    "get_sales",
    "Get all sales with optional filters (date range, email, pagination)",
    {
      after: z.string().optional().describe("ISO 8601 timestamp - only return sales after this date"),
      before: z.string().optional().describe("ISO 8601 timestamp - only return sales before this date"),
      page: z.number().optional().describe("Page number for pagination"),
      email: z.string().optional().describe("Filter sales by customer email"),
    },
    async ({ after, before, page, email }) => {
      try {
        const sales = await gumroad.getSales({ after, before, page, email });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(sales, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get sales: ${errorMessage}`);
      }
    }
  );

  // Register get_sale tool
  server.tool(
    "get_sale",
    "Get details for a specific sale",
    {
      sale_id: z.string().describe("The sale ID"),
    },
    async ({ sale_id }) => {
      try {
        const sale = await gumroad.getSale(sale_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(sale, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get sale: ${errorMessage}`);
      }
    }
  );

  // Register get_products tool
  server.tool(
    "get_products",
    "Get all Gumroad products",
    {},
    async () => {
      try {
        const products = await gumroad.getProducts();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(products, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get products: ${errorMessage}`);
      }
    }
  );

  // Register get_product tool
  server.tool(
    "get_product",
    "Get details for a specific product",
    {
      product_id: z.string().describe("The product ID"),
    },
    async ({ product_id }) => {
      try {
        const product = await gumroad.getProduct(product_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(product, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get product: ${errorMessage}`);
      }
    }
  );

  return server;
}
