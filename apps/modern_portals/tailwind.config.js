module.exports = {
  content: [
    "./modern_portals/www/**/*.html",
    "./modern_portals/templates/**/*.html",
    "./modern_portals/public/js/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        customer: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        supplier: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

