/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  // content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // baloo: ["Baloo2-Regular", "Baloo2-Bold"],
        "baloo2-Regular": ["Baloo2-Regular", "sans-serif"],
        "baloo2-Medium": ["Baloo2-Medium", "sans-serif"],
        "baloo2-SemiBold": ["Baloo2-SemiBold", "sans-serif"],
        "baloo2-Bold": ["Baloo2-Bold", "sans-serif"],
        "baloo2-ExtraBold": ["Baloo2-ExtraBold", "sans-serif"],
      },
  colors: {
        // New color palette
        primary: "#6366F1", // Indigo that's slightly softer
        secondary: "#2DD4BF", // Teal that complements the primary
        accent: "#F59E0B", // Amber for attention/highlights
        danger: "#EF4444", // Red for warnings/delete actions
        background: "#111827", // Darker background for better contrast
        card: "#1F2937", // Slightly lighter than background for cards
        input: "#374151", // Even lighter for input fields
        text: "#F9FAFB", // Almost white text for maximum readability
        textSecondary: "#9CA3AF", // Gray text for less important information
        border: "#4B5563", // Border color for subtle separation
      },
    },
  },
  plugins: [],
};
