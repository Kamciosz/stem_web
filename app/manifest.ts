import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "STEM Koło Technologiczne",
        short_name: "STEM",
        description: "Koło Technologiczne STEM: robotyka, mechatronika, programowanie",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#7c3aed",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon"
            }
        ]
    };
}
