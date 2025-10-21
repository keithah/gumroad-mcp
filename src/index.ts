#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { GumroadClient } from './gumroad-client.js';

// Get access token from environment
const GUMROAD_ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;

if (!GUMROAD_ACCESS_TOKEN) {
  console.error('Error: GUMROAD_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

// Initialize Gumroad client
const gumroad = new GumroadClient({
  accessToken: GUMROAD_ACCESS_TOKEN,
});

// Define available tools
const tools: Tool[] = [
  {
    name: 'get_subscribers',
    description: 'Get all subscribers for a specific Gumroad product',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: {
          type: 'string',
          description: 'The Gumroad product ID',
        },
      },
      required: ['product_id'],
    },
  },
  {
    name: 'get_subscriber',
    description: 'Get details for a specific subscriber',
    inputSchema: {
      type: 'object',
      properties: {
        subscriber_id: {
          type: 'string',
          description: 'The subscriber ID',
        },
      },
      required: ['subscriber_id'],
    },
  },
  {
    name: 'get_sales',
    description: 'Get all sales with optional filters (date range, email, pagination)',
    inputSchema: {
      type: 'object',
      properties: {
        after: {
          type: 'string',
          description: 'ISO 8601 timestamp - only return sales after this date',
        },
        before: {
          type: 'string',
          description: 'ISO 8601 timestamp - only return sales before this date',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination',
        },
        email: {
          type: 'string',
          description: 'Filter sales by customer email',
        },
      },
    },
  },
  {
    name: 'get_sale',
    description: 'Get details for a specific sale',
    inputSchema: {
      type: 'object',
      properties: {
        sale_id: {
          type: 'string',
          description: 'The sale ID',
        },
      },
      required: ['sale_id'],
    },
  },
  {
    name: 'get_products',
    description: 'Get all Gumroad products',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_product',
    description: 'Get details for a specific product',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: {
          type: 'string',
          description: 'The product ID',
        },
      },
      required: ['product_id'],
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: 'gumroad-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_subscribers': {
        const { product_id } = args as { product_id: string };
        const subscribers = await gumroad.getSubscribers(product_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(subscribers, null, 2),
            },
          ],
        };
      }

      case 'get_subscriber': {
        const { subscriber_id } = args as { subscriber_id: string };
        const subscriber = await gumroad.getSubscriber(subscriber_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(subscriber, null, 2),
            },
          ],
        };
      }

      case 'get_sales': {
        const options = args as {
          after?: string;
          before?: string;
          page?: number;
          email?: string;
        };
        const sales = await gumroad.getSales(options);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(sales, null, 2),
            },
          ],
        };
      }

      case 'get_sale': {
        const { sale_id } = args as { sale_id: string };
        const sale = await gumroad.getSale(sale_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(sale, null, 2),
            },
          ],
        };
      }

      case 'get_products': {
        const products = await gumroad.getProducts();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(products, null, 2),
            },
          ],
        };
      }

      case 'get_product': {
        const { product_id } = args as { product_id: string };
        const product = await gumroad.getProduct(product_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(product, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Gumroad MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
