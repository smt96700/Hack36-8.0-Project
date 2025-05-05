![App Screenshot](hackLogo.png)
---
## Team Name : Do_Nothing
### Leader : Sumit Verma
### Member 1 : Solanki Nirmal Bhikhabhai
### Member 2 : Somesh Gupta
### Member 3 : Sumit Chaurasiya
---

[Video Link](https://youtu.be/xXT_s904Ni4?si=rEgIbnRWeCsEBbFG) | [Presentation Link](https://docs.google.com/presentation/d/1rnxP-z77MgNRZpOacMvDxnYQLg2giyFK/edit?usp=sharing&ouid=101641311710268927329&rtpof=true&sd=true)

---


# Plantelligence: Nurture Your Greens, Grow a Greener Tomorrow

##  ~ Vision

**Plantelligence** is a sustainability-driven initiative that empowers individuals and communities to care for plants consciously, collaboratively, and conveniently. Starting with just one plant in your garden, Plantelligence grows into a movement—connecting people through shared green goals and habits.

---

## ~ Highlights

### 1. Intelligent Plant Tracking
Create digital instances of your plants—track their type and watering needs with ease.

### 2. AI-Based Watering Reminders
Our smart system reminds you when your plant needs watering using:
- Weather data  
- Plant species info  
- When you last watered

### 3. Responsibility Sharing
Heading out of town? Just hand over the plant's care digitally to a friend or neighbor with one tap—no more guilt or dead plants!

### 4. Plant Communities
Some plants are in shared spaces—like society gardens or college campuses. Our platform lets you:
- Join or create plant-based communities  
- Collaboratively care for public greenery  
- Share your thoughts among the members via Posts

### 5. Garden Layout & Companion Planting
We help you build an efficient and healthy garden by:
- Mapping your digital garden layout  
- Suggesting ideal companion plants  
- Grouping plants by care similarity and ecological benefits

---

## ~ Why It Matters

### Real Problems We’re Solving:
- Forgotten plants and poor watering routines  
- Lack of awareness in plant care  
- Difficulty in tracking multiple plants  
- Disconnected community efforts for green spaces  

### Our Deeper Purpose:
We're not just a watering app. We are:
- Building eco-conscious habits  
- Encouraging mindful interactions with nature  
- Promoting community-based sustainability  
- Making plant care accessible, low-cost, and scalable  

---


## ~ Tech Stack

- **Framework & Runtime:** Next.js (Full-stack), TypeScript  
- **Database:** MongoDB  
- **Communication:** Nodemailer  
- **AI Agent:** Julep-AI  
- **Deployment & Tooling:** PM2, ts-node  
- **Others:** REST APIs, Weather APIs  

---

## ~ Getting Started

Follow these steps to run the project locally:

### 1. Clone the repository:
```bash
git clone https://github.com/smt96700/Hack36-8.0-Project.git
cd plantelligence
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Create a .env.local file:
```bash
GOOGLE_CLIENT_ID="Your Google Client Id"
GOOGLE_CLIENT_SECRET="Your Google Client Secret"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="Your Next Auth Secret"
MONGODB_URL="Your MongoDB URI"
LLAMAPARSE_API_KEY="Your Llama Parse key"
JULEP_API_KEY="Your Julep AI Key"
OPENWEATHERMAP_API_KEY="Your Open Weather API Key"
```

### 4. Run background worker process:
```bash
npm install -g pm2 typescript ts-node
pm2 start "npx ts-node src/lib/agenda.ts" --name agenda-worker
```

### 5. Run the development server:
```bash
npm run dev
```
Visit http://localhost:3000 to see the app in action.


---

## ~ Contributing

If you'd like to contribute to **Plantelligence**, we welcome your input! Please follow these steps:

1. #### Fork the repository :

   Click on the "Fork" button at the top-right corner of the GitHub page to create your copy of the repository.

2. #### Create a new branch for your feature :
   ```bash
   git checkout -b feature-name
   ```
3. #### Make your changes and commit them : 

    ```bash
    git add .
    git commit -m "Add feature description"
    ```

4. #### Push to the branch :

    ```bash 
    git push origin feature-name
    ```

5. #### Submit a Pull Request :
    Open a pull request on GitHub and provide a detailed description of your changes.

---

## ~ Tagline

#### *Start with one plant. Grow a community. Heal the Earth.*

Let's build a greener, more connected tomorrow—one plant at a time.
If you believe sustainability begins at home, Plantelligence is where it starts.

*We’d love your feedback and support! Let’s grow together.*

![App Screenshot](hackLogo.png)




