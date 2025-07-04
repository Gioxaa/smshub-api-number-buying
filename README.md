<div align="center">
  
# 📱 SMSHub Number Buyer

<img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="version"/>
<img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license"/>
<img src="https://img.shields.io/badge/node-%3E%3D%2012.0.0-brightgreen.svg" alt="node"/>
<img src="https://img.shields.io/badge/platform-windows%20%7C%20macos%20%7C%20linux-lightgrey.svg" alt="platform"/>

*A powerful CLI tool for purchasing and managing virtual phone numbers from SMSHub API, with real-time OTP reception.*

<p align="center">
  <img width="700" src="https://i.imgur.com/4DvHoNE.png" alt="Screenshot">
</p>

</div>

## ✨ Features

- **🔐 Automated OTP Reception** — Real-time monitoring and notification of received verification codes
- **🌐 Service Integration** — Supports multiple service platforms including Amazon, Google, Facebook, and more
- **📊 Smart Balance Management** — Auto-calculates purchase capacity based on your account balance
- **🎨 Beautiful Console UI** — Colorful, interactive interface with real-time updates
- **⚡ Parallel Number Management** — Handle multiple phone numbers simultaneously
- **🔄 Instant Cancellation** — Easily cancel unwanted numbers with a single command

## 🚀 Quick Start

### Prerequisites

- Node.js (version 12.0.0 or later)
- An active [SMSHub](https://smshub.org/) account with API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Gioxaa/smshub-number-buyer.git
   cd smshub-number-buyer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure your API key**

   Edit `config/config.yml` with your SMSHub API key:
   
   ```yaml
   # API credentials
   api_key: 'YOUR_API_KEY_HERE'
   
   # Service settings (leave as is or customize)
   country_code: 73 # Country code (73 for Indonesia)
   service: 'am'    # Service code (am for Amazon)
   ```

### Usage

Run the application:

```bash
npm start
```

You'll see a beautiful interface displaying purchased numbers and their OTP status. Available commands:

- `1` - Cancel all numbers and buy new ones
- `2` - Cancel all numbers and exit
- `c[n]` - Cancel a specific number (e.g., `c1` to cancel the first number)

## 📚 Architecture

The project follows a clean, modular architecture:

```
smshub-api-number-buyer/
├── config/               # Configuration files
├── src/
│   ├── api/              # API client components
│   ├── core/             # Core application logic
│   ├── ui/               # UI components
│   └── utils/            # Utility functions
└── index.js              # Application entry point
```

### Key Components

| Component | Description |
|-----------|-------------|
| `SMSHubClient` | Handles all API interactions with SMSHub |
| `SMSNumberManager` | Core application logic for managing phone numbers |
| `ConsoleUI` | Manages the terminal user interface |
| `Logger` | Provides colorful, structured logging |
| `Config` | Handles configuration loading and validation |

## ⚙️ Configuration Options

All configuration options are stored in `config/config.yml`:

| Option | Description | Default |
|--------|-------------|---------|
| `api_key` | Your SMSHub API key | - |
| `country_code` | Country code for the numbers | `73` (Indonesia) |
| `service` | Service requiring verification | `am` (Amazon) |
| `currency` | Currency code | `840` (USD) |
| `max_price` | Maximum price per number | `0.0450` |
| `operator` | Mobile operator filter | `''` (all) |
| `refresh_interval` | OTP check interval (ms) | `1500` |

## 📊 Service Codes

Common service codes for the `service` configuration:

| Code | Service |
|------|---------|
| `am` | Amazon |
| `go` | Google |
| `fb` | Facebook |
| `tg` | Telegram |
| `wb` | WhatsApp |
| `ig` | Instagram |
| `tw` | Twitter |

> For a complete list, refer to [SMSHub API documentation](https://smshub.org/api).

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure your code follows the project's coding style and includes appropriate tests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SMSHub](https://smshub.org/) for providing the API
- [Chalk](https://github.com/chalk/chalk) for the colorful console output
- [Boxen](https://github.com/sindresorhus/boxen) for the beautiful terminal boxes

---

<div align="center">
  
  **[Features](#-features)** • 
  **[Installation](#-quick-start)** • 
  **[Architecture](#-architecture)** • 
  **[Configuration](#️-configuration-options)** • 
  **[Contributing](#-contributing)**
  
  <sub>Made with ❤️ by <a href="https://github.com/Gioxaa">Gioxaa</a></sub>
</div>
