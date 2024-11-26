# Work Time Tracker Application

## **Application Description**

The Work Time Tracker Application is designed for efficient organization of team and individual work. Below are the features offered by the application:

### **Features**

1. **User Registration:**

   - Register using email and password.
   - After registration, the application generates a confirmation link. The link is returned in the registration response to facilitate testing (without sending an email).

2. **Email Confirmation:**

   - Endpoint for confirming a user's email address using the link returned during registration.

3. **User Login:**

   - Log in using email and password.

4. **Role-based Access System:**

   - Two roles in the application:
     - **Administrator**: Full access to application management, including viewing the total work time of all users and adding new projects.
     - **User**: Limited access, allowing users to track their work time and view available projects.

5. **Work Time Tracking:**

   - Start the work timer with a description of the task and select the project being worked on.
   - Stop the work timer, saving the data in the system.

6. **Work Time Reporting:**

   - Retrieve the total work time of the currently logged-in user, broken down by days, in a format suitable for visualization on a chart.
   - Administrator endpoint to:
     - Retrieve the total work time of all users, broken down by days.
     - Filter reports by users.

7. **Project Management:**
   - Administrators can add new projects.
   - Users can view the list of available projects with sorting and pagination options.

---

## **How to Run the Application**

### **1. Requirements**

- **Node.js** (recommended version 16.x or higher)
- **Docker** and **Docker Compose** (optional, if using containers)
- **Database**: PostgreSQL

---

### **2. Running Locally**

1. **Clone the repository**

   ```bash
   git clone https://github.com/patrykc11/worklog.git
   cd worklog
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Run database migrations**

   ```bash
   pnpm run db:migrate
   ```

5. **Start the application**
   ```bash
   pnpm run start
   ```
