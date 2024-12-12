# daily_tasks_report
full stack app for managing employee tasks
## Prerequisites

To run this project, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** (v7 or later) or **Yarn**
- **PostgreSQL** database
- **Git** (optional, for cloning the repository)



## Configuration

1. **Install backend dependencies:**

   ```bash
   cd Back-End
   npm install

2. **Install frontend dependencies:**

   ```bash
   cd Front-End
   npm install

3. **Create a .env file**
   Create a .env file in the backend directory and add your environment variables:
     
    ```bash
    DBURI=your_postgre_uri
    PORT=your_port
    APP_ID=your_ api_id
    

4. **Running the Application**
   - **Start the backend server:**
      ```bash
      cd Back-End
      npm start

   - **Start the frontend development server:**
      ```bash
      cd Front-End
      npm run dev

## Running the Application with Docker

### Prerequisites

Ensure you have Docker and Docker Compose installed. You can download them from the [Docker website](https://www.docker.com/).

### Steps

1. **Build the Docker images**

   Navigate to the project root directory (where the `docker-compose.yml` file is located) and build the Docker images:

   ```bash
   docker-compose up --build

