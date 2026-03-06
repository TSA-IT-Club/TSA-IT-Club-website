/*
 * ============================================================
 *  data.js — TSA IT Club Website Data
 * ============================================================
 *
 *  HOW TO UPDATE THIS FILE (for non-technical people):
 *
 *  1. Find the section you want to edit (Events, Blog, Projects, Team, Resources).
 *  2. Copy an existing item and paste it below the last item in that section.
 *  3. Change the values inside the quotes "..." to your new content.
 *  4. Make sure every item ends with a comma EXCEPT the very last one.
 *  5. Save this file and refresh the website — your changes will appear!
 *
 *  IMPORTANT RULES:
 *  - Don't delete the square brackets [ ] or curly braces { }
 *  - Don't delete the colons : after property names
 *  - Keep all text values wrapped in quotes "like this"
 *  - true and false are WITHOUT quotes
 *  - To remove an item, delete everything from { to }, (including the comma)
 *
 * ============================================================
 */

const siteData = {
  // ╔════════════════════════════════════════════════════════╗
  // ║  EVENTS                                                ║
  // ║  To add/remove events, copy/delete an item below.     ║
  // ║  Fields: title, month, day, date (YYYY-MM-DD),        ║
  // ║          description, time, location, registerLink    ║
  // ╚════════════════════════════════════════════════════════╝
 "events": [
    {
      "title": "Annual Hackathon 2026",
      "date": "April 15-17, 2026",
      "time": "Starts at 10:00 AM",
      "location": "Main Auditorium, TSA College",
      "description": "Join us for our biggest event of the year! A 48-hour coding marathon where you form teams, solve real-world problems, and build amazing projects from scratch. Mentors will be available, and free food is provided.",
      "registerLink": "https://youtu.be/E4WlUXrJgy4?si=Z9PIfSWa08tUkdhH",
      "isOpen": true
    },
    {
      "title": "Intro to React Workshop",
      "date": "2026-05-04T18:15:00.000Z",
      "time": "2:00 PM - 5:00 PM",
      "location": "Tokha, CRS",
      "description": "A beginner-friendly workshop deep diving into modern web development with React. You'll learn about components, state, hooks, and build your first functioning single-page application.",
      "registerLink": "https://youtu.be/E4WlUXrJgy4?si=Z9PIfSWa08tUkdhH",
      "isOpen": true
    },
    {
      "title": "Cybersecurity CTF",
      "date": "2026-05-19T18:15:00.000Z",
      "time": "9:00 AM - 6:00 PM",
      "location": "loard party palace",
      "description": "Test your security skills in our Capture The Flag competition. Challenges range from web exploitation to reverse engineering. Prizes for the top 3 teams.",
      "registerLink": "https://youtu.be/E4WlUXrJgy4?si=Z9PIfSWa08tUkdhH",
      "isOpen": false
    }
  ],
  "blog": [
    {
      "title": "The Art of Clean Coding",
      "date": "2026-02-27T18:15:00.000Z",
      "category": "Tutorial",
      "excerpt": "Mastering readability and maintainability in modern JavaScript applications.",
      "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      "link": "https://youtu.be/E4WlUXrJgy4?si=Z9PIfSWa08tUkdhH"
    },
    {
      "title": "AI: Beyond the Hype",
      "date": "2026-02-24T18:15:00.000Z",
      "category": "Trends",
      "excerpt": "Exploring practical AI integrations for college projects and startups.",
      "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      "link": "#"
    },
    {
      "title": "HELL NO NO SERVERS PLEASE",
      "date": "2026-10-08T18:15:00.000Z",
      "category": "Torture",
      "excerpt": "Exploring ways to break your back and mind at the same time",
      "image": "https://tse4.mm.bing.net/th/id/OIP.OHEIpSgPcVuAwhr4AvAXegHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      "link": "https://youtu.be/E4WlUXrJgy4?si=Z9PIfSWa08tUkdhH"
    }
  ],
  "projects": [
    {
      "title": "TSA Attendance System",
      "category": "web",
      "description": "A smart QR-based attendance tracking system for college events.",
      "image": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      "tags": [
        "Web App",
        "Node.js"
      ],
      "techStack": "React, Firebase, Node.js",
      "githubLink": "#",
      "modalIcon": "fa-solid fa-qrcode",
      "modalDescription": "A flagship project built by the Web Dev team to modernize how we track attendance during college seminars. It uses dynamic QR codes that refresh every 30 seconds to prevent fraudulent check-ins."
    },
    {
      "title": "Cyber-Sentinel",
      "category": "cyber",
      "description": "A vulnerability scanner tool developed for local network auditing.",
      "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      "tags": [
        "Security",
        "Python"
      ],
      "techStack": "Python, Nmap, Custom Scripts",
      "githubLink": "",
      "modalIcon": "fa-solid fa-shield-virus",
      "modalDescription": "Built by our Cybersecurity enthusiasts, this tool automates basic penetration testing tasks like port scanning and service version detection. It's designed as an educational tool for our workshops."
    },
    {
      "title": "TSA Discord Bot",
      "category": "app",
      "description": "Automating member roles and event notifications for our community.",
      "image": "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=800&q=80",
      "tags": [
        "Bot",
        "JavaScript"
      ],
      "techStack": "Discord.js, MongoDB, Weather & Tech-News APIs",
      "githubLink": "",
      "modalIcon": "fa-brands fa-discord",
      "modalDescription": "Our community hub's brain. This bot handles everything from member verification using college IDs to automated channel management and game-night scheduling."
    },
    {
      "title": "(Robotic omni vehical assistant) R.O.V.A",
      "category": "ROBOT",
      "description": "ATSR FGRE GHDRYH SDGW",
      "image": "https://th.bing.com/th/id/OIP.eKKHjcgYmy0fFTMZrDDbkQHaE7?w=276&h=184&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      "tags": [
        "bot",
        "ai API",
        "llm'S"
      ],
      "techStack": "python js html",
      "githubLink": "",
      "modalIcon": "fa-solid fa-robot",
      "modalDescription": "sadfsdasd asdfaf dfwe dfqwe adfq sadfqw afqw dgwe fggher hjr jhmr atba RV"
    }
  ],
  "resources": [
    {
      "title": "React Fundamentals",
      "description": "Complete handbook for our 4-week frontend workshop.",
      "icon": "fa-solid fa-file-pdf",
      "downloadLink": "https://youtu.be/E4WlUXrJgy4?si=Z9PIfSWa08tUkdhH"
    },
    {
      "title": "Python Starter Kit",
      "description": "Boilerplate code for AI and Automation projects.",
      "icon": "fa-solid fa-code",
      "downloadLink": "#"
    }
  ],
  "team": [
    {
      "name": "MR. Uddhav B. Shrestha",
      "nickname": "Uttam Shrestha",
      "role": "President",
      "type": "exec",
      "avatarInitial": "U",
      "gradient": "linear-gradient(135deg,#3b82f6,#8b5cf6)",
      "image": "images/uttam.jpeg",
      "linkedin": "https://www.keybr.com/",
      "github": "https://github.com/uttam-shrestha/",
      "email": "uttam2066shrestha16@gmail.com",
      "about": "Uttam is the visionary behind the TSA IT Club. He leads the executive board in organizing major events and fostering a strong tech community on campus.",
      "skills": "Leadership, Project Management, Public Speaking"
    },
    {
      "name": "MR. Subash Shrestha",
      "nickname": "Mr. Dev",
      "role": "Web Dev Head",
      "type": "exec",
      "avatarInitial": "S",
      "gradient": "linear-gradient(135deg,#ec4899,#8b5cf6)",
      "image": "",
      "linkedin": "#",
      "github": "#",
      "email": "",
      "about": "Subash is responsible for overseeing all web development projects within the club. He hosts frontend and backend workshops and manages the club's official website infrastructure.",
      "skills": "HTML, CSS, JavaScript, React, Node.js"
    },
    {
      "name": "MR. Nishan Bhandari",
      "nickname": "unuseful",
      "role": "Vice President",
      "type": "exec",
      "avatarInitial": "N",
      "gradient": "linear-gradient(135deg,#06b6d4,#3b82f6)",
      "image": "https://cdn.britannica.com/27/131227-050-4DAD6A15/snail.jpg",
      "linkedin": "#",
      "github": "",
      "email": "#",
      "about": "Nishan works closely with the President to manage internal club operations. He ensures that communication between different departments flows smoothly and assists in planning the annual hackathon.",
      "skills": "Operations Management, Cloud Computing, System Administration"
    },
    {
      "name": "MS. Prithivi raimaghi",
      "nickname": "Mr. prithu",
      "role": "Secretary General",
      "type": "exec",
      "avatarInitial": "P",
      "gradient": "linear-gradient(135deg,#ec4899,#f59e0b)",
      "image": "",
      "linkedin": "#",
      "github": "",
      "email": "#",
      "about": "Priya handles the club's official documentation, meeting minutes, and internal communication between departments.",
      "skills": "Organization, Communication, Documentation"
    },
    {
      "name": "MR. Sanjiv Tamang",
      "nickname": "",
      "role": "Tech Lead Executive",
      "type": "exec",
      "avatarInitial": "R",
      "gradient": "linear-gradient(135deg,#3b82f6,#22c55e)",
      "image": "",
      "linkedin": "#",
      "github": "#",
      "email": "",
      "about": "Rohan leads the technical research and development department, focusing on software architecture and emerging technologies for club projects.",
      "skills": "Software Architecture, DevOps, Full-Stack Development"
    },
    {
      "name": "MR. Ram Thapa",
      "nickname": "",
      "role": "Event Coordinator",
      "type": "board",
      "avatarInitial": "R",
      "gradient": "linear-gradient(135deg,#f59e0b,#ef4444)",
      "image": "",
      "linkedin": "#",
      "github": "",
      "email": "",
      "about": "Ram is the driving force behind the execution of all club events, from small workshops to large-scale seminars.",
      "skills": ""
    },
    {
      "name": "MS. Sita Sharma",
      "nickname": "",
      "role": "Public Relations",
      "type": "board",
      "avatarInitial": "S",
      "gradient": "linear-gradient(135deg,#ec4899,#f59e0b)",
      "image": "",
      "linkedin": "#",
      "github": "",
      "email": "",
      "about": "Sita manages the club's external communications and maintains relationships with college authorities and sponsors.",
      "skills": ""
    },
    {
      "name": "MR. Hari Karki",
      "nickname": "",
      "role": "Treasurer",
      "type": "board",
      "avatarInitial": "H",
      "gradient": "linear-gradient(135deg,#22c55e,#06b6d4)",
      "image": "",
      "linkedin": "#",
      "github": "",
      "email": "",
      "about": "Hari handles the club's finances, budgeting for events, and tracking all member subscriptions and expenditures.",
      "skills": ""
    },
    {
      "name": "MS. Gita Rai",
      "nickname": "",
      "role": "Secretary",
      "type": "board",
      "avatarInitial": "G",
      "gradient": "linear-gradient(135deg,#8b5cf6,#ec4899)",
      "image": "",
      "linkedin": "#",
      "github": "",
      "email": "",
      "about": "Gita keeps detailed records of all club meetings and maintains the official roster and documentation.",
      "skills": ""
    },
    {
      "name": "MR. Suman Shrestha",
      "nickname": "",
      "role": "Technical Lead",
      "type": "board",
      "avatarInitial": "S",
      "gradient": "linear-gradient(135deg,#3b82f6,#22c55e)",
      "image": "",
      "linkedin": "#",
      "github": "",
      "email": "",
      "about": "Suman guides technical workshops and assists club members with debugging and architectural decisions.",
      "skills": ""
    },
    {
      "name": "MS. Anusha Magar",
      "nickname": "",
      "role": "Marketing",
      "type": "board",
      "avatarInitial": "A",
      "gradient": "linear-gradient(135deg,#f59e0b,#8b5cf6)",
      "image": "",
      "linkedin": "#",
      "github": "",
      "email": "",
      "about": "Anusha curates the social media presence and promotional materials to maximize engagement across campus.",
      "skills": ""
    },
    {
      "name": "MR. Bishal KC",
      "nickname": "",
      "role": "Logistics",
      "type": "board",
      "avatarInitial": "B",
      "gradient": "linear-gradient(135deg,#ef4444,#3b82f6)",
      "image": "",
      "linkedin": "#",
      "github": "",
      "email": "",
      "about": "Bishal ensures that all venues, equipment, and physical resources are prepared before any club activity begins.",
      "skills": ""
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = siteData;
}