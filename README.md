

🔐 CipherGuard

Visualizing Encryption and Decryption Using Secret Keys


---

📌 Overview

CipherGuard is an interactive web application that demonstrates how encryption can be modeled using permutation-based transformations and round-based processing.

It bridges concepts from:

Design and Analysis of Algorithms (DAA)

Discrete Mathematical Structures (DMS)


The system provides a step-by-step visual understanding of how data is transformed during encryption and restored during decryption.


---


✨ Features

🔁 Round-Based Visualization
See how data transforms across multiple rounds

🔑 Permutation-Based Keys
Each round uses a position-mapping function

🟥 Avalanche Map
Visualizes how much the output differs from input

🔓 Decryption Verification
Confirms correctness:
Decrypt(Encrypt(x)) = x

📊 Complexity Display
Shows algorithmic efficiency in real-time

🎯 Interactive UI
Character tiles physically move between positions



---

🧠 How It Works

Encryption

M → K₁ → K₂ → ... → Kₖ → Ciphertext

Decryption

C → Kₖ⁻¹ → ... → K₂⁻¹ → K₁⁻¹ → Original

Each Kᵢ is a permutation

Each round transforms the message

Decryption reverses transformations

---

📊 Key Concepts

DAA

Transform & Conquer

Time Complexity Analysis


DMS

Permutations

Function Composition

Inverse Elements



---

🧪 Avalanche Effect

Measures how much the output changes for small input changes.

Displaced: 11/11  
Ratio: 100%

Higher ratio ⇒ stronger transformation (better diffusion)


---

🖥️ Tech Stack

React 18

Framer Motion

Recharts

Tailwind CSS

JavaScript

---

🎯 Purpose

CipherGuard is designed to:

Make encryption concepts easy to understand

Visualize algorithmic transformations

Connect mathematics with real implementations



---

⚠️ Disclaimer

This is an educational tool, not a real-world secure encryption system.


---

👨‍💻 Authors

Krishna Mohan

Chetan Anand N





