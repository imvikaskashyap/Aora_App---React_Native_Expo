import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, SplashScreen, Stack, router } from "expo-router";
import { useFonts } from "expo-font";
import GlobalProvider from "../context/GlobalProvider";
import { getCurrentUser } from "../lib/appWrite";  // Import the getCurrentUser function

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const [isLoading, setIsLoading] = useState(true);  // State to manage the loading status
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to manage the login status

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await getCurrentUser();  // Check if user session exists
        if (currentUser) {
          setIsLoggedIn(true);  // User is logged in
          router.replace("/home");  // Redirect to home
        } else {
          setIsLoggedIn(false);  // No user session
        }
      } catch (error) {
        console.log("Error checking session:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);  // Stop loading
      }
    };

    checkSession();  // Call the function to check session

    if (error) {
      throw error;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded || isLoading) {
    return null;  // Return null while loading fonts or checking session
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
