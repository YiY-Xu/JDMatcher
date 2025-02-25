# JDMatcher

JDMatcher is a web application that analyzes resumes and matches them with job descriptions. This project consists of a backend and a frontend.

## Backend

The backend is built with FastAPI and includes the following dependencies:

- `fastapi`
- `uvicorn`
- `boto3`
- `python-dotenv`
- `pydantic`
- `redis`
- `httpx`

### Installation

1. Navigate to the backend directory:

    ```sh
    cd backend
    ```

2. Install the required packages:

    ```sh
    pip install -r requirements.txt
    ```

3. Run the backend server:

    ```sh
    uvicorn main:app --reload
    ```

### Redis

The backend uses Redis as a persistent layer. Make sure you have Redis installed and running on your machine. You can download and install Redis from [here](https://redis.io/download).

To run Redis using Docker, follow these steps:

1. Pull the Redis Docker image:

    ```sh
    docker pull redis
    ```

2. Run the Redis Docker container:

    ```sh
    docker run -d --name redis -p 6379:6379 redis
    ```

## Frontend

The frontend is built with React and Vite. It includes the following dependencies:

- `axios`
- `lucide-react`
- `react`
- `react-dom`
- `spark-md5`

### Installation

1. Navigate to the frontend directory:

    ```sh
    cd frontend
    ```

2. Install the required packages:

    ```sh
    npm install
    ```

3. Run the frontend development server:

    ```sh
    npm run dev
    ```

## Running n8n Workflow Locally

To run the n8n workflow locally, follow these steps:

### Prerequisites

Make sure you have Docker installed on your machine. You can download and install Docker from [here](https://www.docker.com/get-started).

### Steps

1. Pull the n8n Docker image:

    ```sh
    docker pull n8nio/n8n
    ```

2. Create a directory to store n8n data:

    ```sh
    mkdir -p ~/.n8n
    ```

3. Run the n8n Docker container:

    ```sh
    docker run -it --rm \
        --name n8n \
        -p 5678:5678 \
        -v ~/.n8n:/home/node/.n8n \
        n8nio/n8n
    ```

4. Open your browser and navigate to `http://localhost:5678` to access the n8n workflow editor.

5. Create or import your workflow in the n8n editor.

6. Execute the workflow to test it locally.

### Notes

- The `-v ~/.n8n:/home/node/.n8n` option mounts the local directory `~/.n8n` to the container's directory `/home/node/.n8n`, allowing you to persist your workflows and credentials.
- The `-p 5678:5678` option maps the container's port 5678 to your local machine's port 5678, making the n8n editor accessible via `http://localhost:5678`.

For more information on using n8n, refer to the [n8n documentation](https://docs.n8n.io/).

## Running crawl4ai Locally

To run crawl4ai locally, follow these steps:

### Prerequisites

Make sure you have Docker installed on your machine. You can download and install Docker from [here](https://www.docker.com/get-started).

### Steps

1. Pull the crawl4ai Docker image:

    ```sh
    docker pull crawl4ai/crawl4ai
    ```

2. Run the crawl4ai Docker container:

    ```sh
    docker run -it --rm \
        --name crawl4ai \
        -p 8080:8080 \
        crawl4ai/crawl4ai
    ```

3. Open your browser and navigate to `http://localhost:8080` to access the crawl4ai interface.

4. Configure and start your crawling tasks using the crawl4ai interface.

### Notes

- The `-p 8080:8080` option maps the container's port 8080 to your local machine's port 8080, making the crawl4ai interface accessible via `http://localhost:8080`.

For more information on using crawl4ai, refer to the [crawl4ai documentation](https://docs.crawl4ai.io/).

## Usage

1. Start the backend server.
2. Start the frontend development server.
3. Open your browser and navigate to the frontend development server URL (usually `http://localhost:5173`).

## Components

## License

This project is licensed under the MIT License.