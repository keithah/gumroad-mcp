FROM node:20-alpine

WORKDIR /app

# Copy pre-built Smithery shttp bundle (it's already bundled with all dependencies)
COPY .smithery/shttp/index.cjs ./index.cjs

# Expose port for streamable HTTP
EXPOSE 3000

# Run the shttp server
CMD ["node", "index.cjs"]
