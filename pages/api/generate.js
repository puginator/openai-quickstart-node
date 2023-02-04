import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }


  const blog = req.body.blog || "";
  if (blog.trim().length === 0) {
    res.status(400).json({
      error: {
        messag3e: "Please enter a valid article",
      },
    });
    return;
  }

  const keywords = req.body.keywords || "";
  // if (keywords.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       messag3e: "Please enter a valid article",
  //     },
  //   });
  //   return;
  // }

  // const animal = req.body.animal || '';
  // if (animal.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       messag3e: "Please enter a valid animal",
  //     }
  //   });
  //   return;
  // }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateMeta(blog, keywords),
      max_tokens: 500,
      temperature: req.temp,
    });

    res.status(200).json({ result: completion.data.choices[0].text, tokens: completion.data.usage.total_tokens});
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

// function generateMeta(blog, keywords) {
//   if (keywords) {
//     return `write a unique meta description about the article below. Use a max of 75 words. The keywords must be used in the description.
//     article:${blog}
//     keywords:"${keywords}"
//   `
//   }
//   return `write a unique meta description about the article below. Use a max of 75 words.
//   article:${blog}
//   `
// }

function generateMeta(blog, keywords) {
  if (keywords) {
    return `Generate a unique meta description for my article summarizing in under 40 words the main idea or theme. Utilize the keywords in the summary
    article:${blog}
    keywords:"${keywords}"
  `;
  }
  return `Generate a unique meta description for my article summarizing in under 40 words the main idea or theme.
  article:${blog}
  `;
}