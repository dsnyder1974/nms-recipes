# NMS Recipes

A modern React web application for managing recipes for the game No Man's Sky. Built with a focus on performance, clean UI, and modular design.

---

## 🚀 Project Overview

NMS Recipes currently is a React-based front-end that allows users to view, create, and manage recipe categories. It connects to an AWS-backed serverless API for data management.

Key features include:

- Custom built datagrid for dynamic table display for categories
- Integration with a cloud-based backend (AWS Lambda, RDS)
- Built with accessibility and responsiveness in mind

---

## 🛠️ Tech Stack

- **\*Notion** (project management & documentation) [Notion Link](https://perpetual-cobalt-b4e.notion.site/1f50ea20f0f480339cf7f733b899b07a?v=1f50ea20f0f4814d8434000ca574d7d9&source=copy_link)\*
- **React** (functional components + hooks)
- **React Router** (routing)
- **Custom API Integration** (fetching categories from a remote API)
- **CSS Modules** for scoped styling
- **ESLint** & **Prettier** for code consistency

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/nms-recipes.git
   cd nms-recipes
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`.

---

## 🔧 Project Structure

```
/public        → Static files (index.html, favicon, etc.)
/src
  /api         → API interaction helpers
  /components  → Reusable UI components
  /Categories  → Feature modules (Category table, rows, selects)
  App.jsx      → Main app component
  index.js     → React app entry point
```

---

## 📚 Scripts

- `npm start` — Start the development server
- `npm run build` — Build the production-ready app
- `npm test` — Run tests

---

## 🌐 Deployment

This project can be easily deployed to AWS Amplify, Netlify, or Vercel.
A typical build command for hosting providers:

```bash
npm run build
```

Uploads the `build/` folder contents.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

- React documentation
- AWS for the serverless backend
