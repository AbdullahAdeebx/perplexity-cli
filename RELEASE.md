# perplexity-cli v1.0.0 - Initial Release

## Overview
perplexity-cli is a command-line interface tool that allows you to interact with the Perplexity API directly from your terminal. Ask questions, get AI-powered responses, and streamline your workflow without leaving the command line.

## Features
- 🔍 **Query Perplexity AI**: Run natural language queries directly from your terminal
- 🌊 **Stream Responses**: Watch responses generate in real-time with the `--stream` option
- 💾 **Save Results**: Export responses to files with the `--output` option
- 🔄 **Query History**: View your recent query history
- 🔐 **API Key Management**: Securely store and manage your Perplexity API key
- 🤖 **Multiple Models**: Choose from various Perplexity AI models

## Supported Models
- `sonar`: Default, balanced speed and capability
- `sonar-small`: Fastest, least capable
- `sonar-medium`: Good balance of speed and capability
- `sonar-large`: Most capable, slower
- `codellama-70b`: Specialized for code generation
- `mistral-7b`: Open-source model
- `mixtral-8x7b`: Mixture of experts model
- `llama-3-70b`: Meta's latest model

## Installation

### NPM (Recommended)
```bash
npm install -g perplexity-cli
```

### Direct Use
```bash
npx perplexity-cli
```

### From Source
```bash
git clone https://github.com/AbdullahAdeebx/perplexity-cli.git
cd perplexity-cli
npm install
npm link
```

## Quick Start
1. Set your API key:
   ```bash
   perplexity-cli set-key YOUR_API_KEY_HERE
   ```

2. Run your first query:
   ```bash
   perplexity-cli query "What is the capital of France?"
   ```

3. Try streaming a response:
   ```bash
   perplexity-cli query "Explain quantum computing" --stream
   ```

## Requirements
- Node.js ≥ 14.0.0
- Perplexity API key ([Get one here](https://docs.perplexity.ai/docs/getting-started))

## Documentation
For complete documentation, visit the [GitHub repository](https://github.com/AbdullahAdeebx/perplexity-cli).

## License
MIT