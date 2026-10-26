# Prism Outlook Add-in

An Outlook add-in that automatically classifies incoming emails into **dynamic, organization-defined categories**.

Administrators define the categories that fit their business (for example Finance, Real Estate, Legal), and the system learns to sort emails into them. No categories are hard-coded, so the same product adapts to any company.

## Features

- Automatic email classification directly inside Outlook
- Dynamic categories defined by the organization admin
- Machine-learning classifier based on Naive Bayes, with custom enhancements
- Task pane UI built with React and TypeScript
- Communicates with a C# ASP.NET Core Web API (see [Prism](https://github.com/hadasagavra/Prism))

## Tech Stack

| Layer | Technology |
|-------|------------|
| Add-in client | TypeScript, React, Office.js, Webpack |
| Backend | C#, ASP.NET Core Web API |
| Classification | Naive Bayes (enhanced) |

## How It Works

1. An admin defines the categories for the organization.
2. The classifier is trained on labeled emails for those categories.
3. When an email is opened or received, the add-in sends its content to the Web API.
4. The API returns the predicted category, which the add-in applies in Outlook.

## Architecture

```
Outlook  <->  Prism Add-in (React + TypeScript + Office.js)
                    |
                    |  HTTPS / JSON
                    v
              Prism Web API (C#, ASP.NET Core)
                    |
                    v
           Naive Bayes classifier + category store
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- Microsoft Outlook (desktop or web) with add-in sideloading enabled
- The Prism backend running locally or deployed

### Installation

```bash
git clone https://github.com/hadasagavra/PrismAddIn.git
cd PrismAddIn
npm install
```

### Run in development

```bash
npm start
```

This builds the add-in with Webpack and sideloads it into Outlook using the provided manifest.

### Build for production

```bash
npm run build
```

### Configuration

Point the add-in to your backend by setting the API base URL in the project configuration before building.

## Project Structure

```
PrismAddIn/
├── assets/          Icons and static resources
├── src/             Add-in source code (TypeScript / React)
├── manifest.xml     Outlook add-in manifest
├── manifest.json    Unified manifest
└── webpack.config.js
```

## Screenshots

Add one or two screenshots of the task pane here, for example `![Task pane](assets/screenshot.png)`.

## Roadmap

- Feedback loop so users can correct a classification and improve the model
- Support for additional languages
- Classification accuracy dashboard

## Author

Hadasa Gavra — [GitHub](https://github.com/hadasagavra)
