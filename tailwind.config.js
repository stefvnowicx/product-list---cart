module.exports = {
   mode: "jit",
   purge: [
      './index.html',
   ],
   content: [
      "./index.html", // Określ ścieżki do swoich plików HTML i JS
   ],
   theme: {
      extend: {
         fontFamily: {
            sans: ["Red Hat Text", "sans-serif"]
         }
      },
   },
   plugins: [],
};

// npm run build/watch
