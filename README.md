# Gumroad MCP Server

A Model Context Protocol (MCP) server for the Gumroad API, enabling AI assistants to look up subscription information, sales data, and product details.

## Features

- **Subscription Management**: Get subscriber lists and individual subscriber details
- **Sales Data**: Query sales with filters (date range, email, pagination)
- **Product Information**: Retrieve product listings and details
- **Type-Safe**: Written in TypeScript with comprehensive type definitions
- **Smithery Compatible**: Ready to deploy on Smithery.ai

## Available Tools

### Subscribers

- `get_subscribers` - Get all subscribers for a specific product
- `get_subscriber` - Get details for a specific subscriber

### Sales

- `get_sales` - Get all sales with optional filters (date range, email, pagination)
- `get_sale` - Get details for a specific sale

### Products

- `get_products` - Get all your Gumroad products
- `get_product` - Get details for a specific product

## Installation

### Using Smithery (Recommended)

1. Visit [Smithery.ai](https://smithery.ai)
2. Search for "gumroad-mcp" or install directly from this repository
3. Configure with your Gumroad access token
4. Deploy and use in Claude Desktop or other MCP clients

### Manual Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gumroad-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
GUMROAD_ACCESS_TOKEN=your_token_here npm start
```

## Configuration

### Getting Your Gumroad Access Token

1. Go to https://gumroad.com/api
2. Click "Create an application"
3. Generate an access token
4. Copy the token for use in configuration

### Environment Variables

- `GUMROAD_ACCESS_TOKEN` (required) - Your Gumroad API access token

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gumroad": {
      "command": "node",
      "args": ["/path/to/gumroad-mcp/dist/index.js"],
      "env": {
        "GUMROAD_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Usage Examples

### Get Product Subscribers

```
Get all subscribers for product ID "abc123"
```

The assistant will call `get_subscribers` with `product_id: "abc123"`.

### Query Sales by Email

```
Show me all sales for customer@example.com
```

The assistant will call `get_sales` with `email: "customer@example.com"`.

### Get Sales in Date Range

```
Show me all sales from January 2025
```

The assistant will call `get_sales` with appropriate `after` and `before` timestamps.

## API Response Examples

### Subscriber

```json
{
  "id": "sub_123",
  "product_id": "prod_abc",
  "product_name": "My Product",
  "user_email": "customer@example.com",
  "status": "alive",
  "recurrence": "monthly",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Sale

```json
{
  "id": "sale_123",
  "email": "customer@example.com",
  "product_name": "My Product",
  "price": 2900,
  "formatted_display_price": "$29",
  "timestamp": "2025-01-01T00:00:00Z",
  "is_recurring_billing": true,
  "subscription_id": "sub_123"
}
```

## Development

```bash
# Install dependencies
npm install

# Build in watch mode
npm run dev

# Build for production
npm run build

# Run the server
npm start
```

## API Permissions

The server requires a Gumroad access token with the following scopes:

- `view_sales` - To read sales and subscription data
- `view_profile` - To read product information

## Error Handling

All tools include comprehensive error handling. If an API call fails, you'll receive a descriptive error message explaining what went wrong.

## License

MIT

## Links

- [Gumroad API Documentation](https://gumroad.com/api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Smithery](https://smithery.ai)
