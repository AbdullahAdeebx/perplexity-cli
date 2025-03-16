#!/usr/bin/env node

const { program } = require('commander');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const os = require('os');

// Configuration management
const CONFIG_DIR = path.join(os.homedir(), '.perplexity-cli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Helper functions for config management
function getConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error(chalk.red('Error reading config file:'), error.message);
  }
  return {};
}

function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error(chalk.red('Error saving config file:'), error.message);
    return false;
  }
}

// Function to save query to history
function saveToHistory(question, model) {
  const config = getConfig();
  const history = config.history || [];
  
  // Add new query to history
  history.unshift({
    question,
    model,
    timestamp: Date.now()
  });
  
  // Keep only the last 10 queries
  config.history = history.slice(0, 10);
  saveConfig(config);
}

// Define CLI metadata
program
  .version('1.0.0')
  .description('A CLI tool to interact with the Perplexity API');

// Command to set the API key
program
  .command('set-key <key>')
  .description('Set the Perplexity API key')
  .action((key) => {
    const config = getConfig();
    config.apiKey = key;
    if (saveConfig(config)) {
      console.log(chalk.green('✓ API key set successfully.'));
    }
  });

// Command to view the current API key (masked)
program
  .command('view-key')
  .description('View the currently set API key (masked)')
  .action(() => {
    const config = getConfig();
    const apiKey = config.apiKey;
    
    if (!apiKey) {
      console.error(chalk.red('✗ API key not set. Use "perplexity-cli set-key <key>" to set it.'));
      return;
    }
    
    // Mask the API key, showing only the first 4 and last 4 characters
    const maskedKey = `${apiKey.substring(0, 4)}${'*'.repeat(apiKey.length - 8)}${apiKey.substring(apiKey.length - 4)}`;
    console.log(chalk.blue('Current API key:'), chalk.yellow(maskedKey));
  });

// Command to send a query to the Perplexity API
program
  .command('query <question>')
  .description('Send a query to the Perplexity API')
  .option('-m, --model <model>', 'Specify the model to use (default: sonar)')
  .option('-s, --stream', 'Stream the response as it is generated')
  .option('-o, --output <file>', 'Save the response to a file')
  .action(async (question, options) => {
    const config = getConfig();
    const apiKey = config.apiKey;
    
    if (!apiKey) {
      console.error(chalk.red('✗ API key not set. Use "perplexity-cli set-key <key>" to set it.'));
      return;
    }

    const model = options.model || 'sonar';
    const stream = options.stream || false;
    const outputFile = options.output;
    
    // Save this query to history
    saveToHistory(question, model);
    
    let spinner;
    if (!stream) {
      spinner = ora('Thinking...').start();
    } else {
      console.log(chalk.cyan('📝 Streaming response:'));
    }

    // Configure the OpenAI SDK to use Perplexity's API
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.perplexity.ai',
    });

    try {
      if (stream) {
        // Stream the response
        const stream = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: 'Be precise and concise.' },
            { role: 'user', content: question },
          ],
          stream: true,
        });

        let fullResponse = '';
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            process.stdout.write(chalk.white(content));
            fullResponse += content;
          }
        }
        console.log(); // Add a newline at the end

        // Save to file if requested
        if (outputFile) {
          fs.writeFileSync(outputFile, fullResponse);
          console.log(chalk.green(`\n✓ Response saved to ${outputFile}`));
        }
      } else {
        // Regular non-streaming response
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: 'system', content: 'Be precise and concise.' },
            { role: 'user', content: question },
          ],
        });
        
        spinner.stop();
        const response = completion.choices[0].message.content;
        console.log(chalk.cyan('\n📝 Response:'));
        console.log(chalk.white(response));
        
        // Save to file if requested
        if (outputFile) {
          fs.writeFileSync(outputFile, response);
          console.log(chalk.green(`\n✓ Response saved to ${outputFile}`));
        }
        
        // Display usage information if available
        if (completion.usage) {
          console.log(chalk.gray('\nTokens used:'), 
            chalk.yellow(`${completion.usage.prompt_tokens} prompt + ${completion.usage.completion_tokens} completion = ${completion.usage.total_tokens} total`));
        }
      }
    } catch (error) {
      if (spinner) {
        spinner.stop();
      }
      console.error(chalk.red('✗ Error:'), error.message);
      if (error.message.includes('API key')) {
        console.log(chalk.yellow('Tip: Make sure your Perplexity API key is valid.'));
      } else if (error.message.includes('model')) {
        console.log(chalk.yellow(`Tip: The model "${model}" might not be available. Try using "sonar" instead.`));
      }
    }
  });

// Command to list available models
program
  .command('models')
  .description('List available Perplexity API models')
  .action(() => {
    console.log(chalk.cyan('Available Perplexity Models:'));
    console.log(chalk.yellow('- sonar') + chalk.gray(' (Default, balanced speed and capability)'));
    console.log(chalk.yellow('- sonar-small') + chalk.gray(' (Fastest, least capable)'));
    console.log(chalk.yellow('- sonar-medium') + chalk.gray(' (Good balance of speed and capability)'));
    console.log(chalk.yellow('- sonar-large') + chalk.gray(' (Most capable, slower)'));
    console.log(chalk.yellow('- codellama-70b') + chalk.gray(' (Specialized for code generation)'));
    console.log(chalk.yellow('- mistral-7b') + chalk.gray(' (Open-source model)'));
    console.log(chalk.yellow('- mixtral-8x7b') + chalk.gray(' (Mixture of experts model)'));
    console.log(chalk.yellow('- llama-3-70b') + chalk.gray(' (Meta\'s latest model)'));
    
    console.log(chalk.gray('\nUse with: perplexity-cli query "Your question" --model model-name'));
  });

// Command to clear the API key
program
  .command('clear-key')
  .description('Clear the stored API key')
  .action(() => {
    const config = getConfig();
    delete config.apiKey;
    if (saveConfig(config)) {
      console.log(chalk.green('✓ API key cleared successfully.'));
    }
  });

// Command to view history of queries
program
  .command('history')
  .description('View history of recent queries')
  .action(() => {
    const config = getConfig();
    const history = config.history || [];
    
    if (history.length === 0) {
      console.log(chalk.yellow('No query history found.'));
      return;
    }
    
    console.log(chalk.cyan('Recent Queries:'));
    history.forEach((item, index) => {
      console.log(chalk.white(`${index + 1}. ${item.question}`));
      console.log(chalk.gray(`   Date: ${new Date(item.timestamp).toLocaleString()}`));
      console.log(chalk.gray(`   Model: ${item.model}`));
      console.log();
    });
  });

// Parse command-line arguments
program.parse(process.argv);

// If no arguments provided, show help
if (process.argv.length === 2) {
  program.help();
}
