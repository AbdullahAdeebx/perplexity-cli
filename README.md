# perplexity-cli

A command-line interface (CLI) app that allows you to run queries using Perplexity's API directly from your terminal.

## Installation

### Local Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/perplexity-cli.git
cd perplexity-cli

# Install dependencies
npm install

# Link the CLI globally
npm link
```

### Global Installation (once published)

```bash
npm install -g perplexity-cli
```

Or run directly without installation:

```bash
npx perplexity-cli
```

## Setup

Before using the CLI, you need to set your Perplexity API key:

```bash
perplexity-cli set-key YOUR_API_KEY_HERE
```

You can get your API key from the [Perplexity API Settings page](https://docs.perplexity.ai/docs/getting-started).

## Usage

### Running Queries

```bash
perplexity-cli query "What is the capital of France?"
```

### Stream the Response in Real-Time

```bash
perplexity-cli query "Explain quantum computing" --stream
```

### Save the Response to a File

```bash
perplexity-cli query "Write a short story about AI" --output story.txt
```

### Specify a Different Model

```bash
perplexity-cli query "Explain quantum computing" --model sonar-large
```

### View Query History

```bash
perplexity-cli history
```

### View Available Models

```bash
perplexity-cli models
```

### View Your API Key (Masked)

```bash
perplexity-cli view-key
```

### Clear Your API Key

```bash
perplexity-cli clear-key
```

## Available Commands

- `set-key <key>`: Set your Perplexity API key
- `view-key`: View your currently set API key (masked)
- `query <question>`: Send a query to the Perplexity API
- `models`: List available Perplexity API models
- `history`: View history of recent queries
- `clear-key`: Clear your stored API key

## Options for Query Command

- `-m, --model <model>`: Specify the model to use for your query (default: sonar)
- `-s, --stream`: Stream the response as it is generated
- `-o, --output <file>`: Save the response to a file
- `-h, --help`: Display help information
- `-V, --version`: Display version information

## Models

The CLI supports various Perplexity models:

- `sonar`: Default, balanced speed and capability
- `sonar-small`: Fastest, least capable
- `sonar-medium`: Good balance of speed and capability
- `sonar-large`: Most capable, slower
- `codellama-70b`: Specialized for code generation
- `mistral-7b`: Open-source model
- `mixtral-8x7b`: Mixture of experts model
- `llama-3-70b`: Meta's latest model

## License

MIT
