# Offline Journal

A private journaling application built with Svelte and RxDB that lets you write and store your thoughts offline. Your entries are stored locally with optional cloud sync capabilities through Appwrite.

## Features

- ✍️ Create, edit, and manage journal entries
- 💾 Offline-first approach using RxDB for local storage
- 🔄 Optional cloud sync with Appwrite
- 🔐 Privacy-focused - all data stays on your device by default
- 📱 Responsive design that works on all devices
- ⚡ Fast and lightweight
- 🎯 Clean and intuitive interface

## Technical Stack

- **Frontend**: Svelte 5 with SvelteKit
- **Database**: RxDB with LocalStorage adapter
- **Cloud Sync**: Appwrite backend (optional)
- **Build Tool**: Vite

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables:
   - Copy `.env.example` to `.env`
   - Update the `.env` file with your Appwrite project details:
     ```
     PUBLIC_APPWRITE_ENDPOINT=your-appwrite-endpoint
     PUBLIC_APPWRITE_PROJECT_ID=your-project-id
     PUBLIC_APPWRITE_DATABASE_ID=your-database-id
     PUBLIC_APPWRITE_COLLECTION_ID=your-collection-id
     ```

4. Start the development server:
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
