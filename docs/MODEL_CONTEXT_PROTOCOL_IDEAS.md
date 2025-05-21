# Model Context Protocol (MCP)

This project adopts the official **Model Context Protocol (MCP)**, a standard for enabling AI models to access user-specific context. You can find more information about the standard at [modelcontextprotocol.io](https://modelcontextprotocol.io).

Our project includes an implementation of an MCP server, located in the `mcp-server/` directory. This server utilizes the official TypeScript SDK (`@modelcontextprotocol/sdk`) to expose user calendar data and scheduling tools according to the MCP standard.

All previous brainstorming content related to a custom API for model context has been superseded by the adoption of the official MCP. For details on our specific MCP server implementation, please see `docs/MCP_SERVER_DETAILS.md`.
