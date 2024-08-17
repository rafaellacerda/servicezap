import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";
import { SocketContext, SocketManager } from "./context/Socket/SocketContext";

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
  const [locale, setLocale] = useState();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredTheme = window.localStorage.getItem("preferredTheme");
  const [mode, setMode] = useState(
    preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light"
  );

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = createTheme(
    {
      scrollbarStyles: {
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
          backgroundColor: "#F3F3F3",
        },
      },
      scrollbarStylesSoft: {
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: mode === "light" ? "#F3F3F3" : "#181b23",
        },
      },
      palette: {
        type: mode,
        primary: { main: mode === "light" ? "#9C8552" : "#FFFFFF" },
        textPrimary: mode === "light" ? "#9C8552" : "#FFFFFF",
        borderPrimary: mode === "light" ? "#9C8552" : "#FFFFFF",
        dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
        light: { main: mode === "light" ? "#F3F3F3" : "#181b23" },
        tabHeaderBackground: mode === "light" ? "#EEE" : "#14161d",
        optionsBackground: mode === "light" ? "#fafafa" : "#181b23",
        options: mode === "light" ? "#fafafa" : "#181b23",
        fontecor: mode === "light" ? "#128c7e" : "#fff",
        fancyBackground: mode === "light" ? "#fafafa" : "#14161d", // Fundo
        bordabox: mode === "light" ? "#eee" : "#14161d",
        newmessagebox: mode === "light" ? "#eee" : "#181b23",
        inputdigita: mode === "light" ? "#fff" : "#fff",
        contactdrawer: mode === "light" ? "#fff" : "#181b23",
        announcements: mode === "light" ? "#ededed" : "#181b23",
        login: mode === "light" ? "#fff" : "#14161d",
        announcementspopover: mode === "light" ? "#fff" : "#181b23",
        chatlist: mode === "light" ? "#eee" : "#14161d",
        boxlist: mode === "light" ? "#ededed" : "#181b23",
        boxchatlist: mode === "light" ? "#ededed" : "#181b23",
        total: mode === "light" ? "#fff" : "#222",
        messageIcons: mode === "light" ? "grey" : "#F3F3F3",
        inputBackground: mode === "light" ? "#FFFFFF" : "#fff",
        barraSuperior: mode === "light" ? "#fafafa" : "#14161d", // Header
        boxticket: mode === "light" ? "#EEE" : "#181b23",
        campaigntab: mode === "light" ? "#ededed" : "#181b23",
        mediainput: mode === "light" ? "#ededed" : "#1c1c1c",
        mainPage: mode === "light" ? "#fff" : "#181b23",
        headerMenu: mode === "light" ? "#ededed" : "#14161d",
      },
      mode,
    },
    locale
  );

  useEffect(() => {
    const i18nlocale = localStorage.getItem("i18nextLng");
    const browserLocale =
      i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

    if (browserLocale === "ptBR") {
      setLocale(ptBR);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("preferredTheme", mode);
  }, [mode]);

  return (
    <ColorModeContext.Provider value={{ colorMode }}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <SocketContext.Provider value={SocketManager}>
            <Routes />
          </SocketContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
