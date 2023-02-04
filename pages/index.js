import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [blogInput, setBlogInput] = useState("");
  const [temp, setTemp] = useState(.6);
  const [tokens, setTokens] = useState("");
  const [result, setResult] = useState();
  const [keywordsInput, setKeywordsInput] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blog: blogInput, keywords:keywordsInput }),
        temp: temp,
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setTokens(data.tokens);
      setResult(data.result);
      // setAnimalInput("");
      setBlogInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const changeTemp = (event) => {
    setTemp(event.target.value);
  };
      

  return (
    <div>
      <Head>
        <title>Hounder OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Create a meta description</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="textarea"
            rows="15"
            cols="33"
            name="blog"
            placeholder="Enter a blog"
            value={blogInput}
            onChange={(e) => setBlogInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter keywords"
            name="keywords"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
          />
          <div className="temperature">{temp} Temperature</div>
          <input
            type="range"
            onChange={changeTemp}
            min={0}
            max={1}
            step={0.1}
            value={temp}
          />
          <input type="submit" value="Generate meta description" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.result}>{tokens} Tokens were used in total</div>
      </main>
    </div>
  );
}
