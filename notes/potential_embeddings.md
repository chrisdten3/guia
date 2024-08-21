## Potential Embedding Models We Could Use

**I went on Google and searched for the embedding models that were the best for interpreting mixed natural language and code. Here's what I found:**

- Instructor XL Embedding Model [https://huggingface.co/hkunlp/instructor-xl](https://huggingface.co/hkunlp/instructor-xl) 
	- Comments:
		"Have you tried the Instructor-XL Embedding Model? Its currently in the second place on the MTEB leaderboard.
		
		I am not sure if the e5 model (first on the MTEB leaderboard) would work well with your data.
		
		The Instructor-XL paper mentions that they trained it on retrieving data with code (CodeSearchNet).
		
		I have extensively tested OpenAI's embeddings (ada-002) and a lot of other sentence-transformers models to create embeddings for Financial documents. The Instructor-XL model has shown a significant improvement over all of the other models. I suggest you give it a try.
		
		The Table-7 in the Appendix of the paper is a good place to start if you need to create the Instructions for creating the embeddings for your data.
		
		Some resources if you decide to use the Instructor-XL model:"

- Open AI text-embedding-ada-002
	https://platform.openai.com/docs/guides/embeddings/what-are-embeddings
	- Comments: "Looking at the top of the results, the clear best performing model is the OpenAI text-embedding-ada-002, with an average of 0.821, nearly 3 points higher then the next best performing model GTE-Large with a score of 0.784"
