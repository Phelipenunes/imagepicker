import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default function App() {
  const [foto, setFoto] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  console.log(status);

  useEffect(() => {
    async function verificarPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }
    verificarPermissoes();
  }, []);

  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.cancelled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!imagem.cancelled) {
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0].uri);
    }
  };

  const compartilhar = async () => {
    try {
      if (foto) {
        await Sharing.shareAsync(foto);
      } else {
        alert("Você precisa escolher uma foto antes de compartilhar!");
      }
    } catch (error) {
      console.log("Erro ao compartilhar:", error.message);
    }
  };

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <Button onPress={acessarCamera} title="Tirar uma foto" />
        <Button onPress={escolherFoto} title="Escolher foto" />
        {foto ? (
          <Image source={{ uri: foto }} style={styles.image} />
        ) : (
          <Text>Você ainda não escolheu uma foto!</Text>
        )}
        <Button onPress={compartilhar} title="Compartilhar" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
});
