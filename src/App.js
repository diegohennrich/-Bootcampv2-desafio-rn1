import React, { useEffect, useState } from "react";
import api from "./services/api";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/repositories");
        console.log("data: ", data);
        setRepositories(data);
      } catch (e) {
        console.log("erro: ", e);
      }
    }

    load();
  }, []);

  async function handleLikeRepository(id) {
    try {
      await api.post(`/repositories/${id}/like`);
      const index = repositories.findIndex(i => i.id === id);

      let newList = repositories.map((i, currIndex) => ({
        ...i,
        likes: currIndex === index ? (i.likes = i.likes + 1) : i.likes
      }));

      setRepositories(newList);
    } catch (e) {
      console.log("erro: ", e);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        {repositories &&
          repositories.map(i => (
            <View style={styles.repositoryContainer} key={i.id}>
              <Text style={styles.repository}>{i.title}</Text>

              <View style={styles.techsContainer}>
                {i.techs.map(curr => (
                  <Text style={styles.tech} key={curr}>
                    ReactJS
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${i.id}`}
                >
                  {i.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(i.id)}
                testID={`like-button-${i.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          ))}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1"
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold"
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff"
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10
  },
  button: {
    marginTop: 10
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15
  }
});
