# 🏥 Appointment Calendar for Clinic Staff

A responsive, frontend-only calendar application built with **React.js**, **Tailwind CSS**, and **jQuery** (optional for small UI interactions), designed to help clinic or hospital front desk staff manage doctor appointments easily and efficiently.

## 📌 Project Overview

This project provides a **simple appointment management system** without a backend. All data is stored in the browser using **localStorage**, making it fast, lightweight, and ideal for demo or internal use cases.

## 🚀 Features

### ✅ Login (Mock Authentication)
- Simple email/password login form
- Hardcoded credentials:
- Redirects to the calendar upon successful login

### 🗓️ Calendar View
- **Desktop**:
- Month view with compact listing of daily appointments
- Click a day to add/edit appointments
- **Mobile**:
- One-day-at-a-time view
- Date picker to jump to any date
- Scrollable vertical layout for usability

### 👩‍⚕️ Appointments
- Appointment includes:
- Patient (select dropdown)
- Doctor (select dropdown)
- Time (time picker)
- Fixed list of patients and doctors (via JSON or hardcoded)
- Add/Edit appointments via a modal form
- Data stored in `localStorage` (persistent across refresh)

### 🧠 Calendar Logic
- Displays only the **current month**
- Skips blank leading days for clean layout
- (Optional) Grey-out adjacent month days

## 🌟 Nice-to-Haves
- [x] Delete appointments
- [x] Filter by doctor or patient
- [x] Dark mode toggle


## 💻 Tech Stack

| Technology       | Purpose                            |
|------------------|-------------------------------------|
| React.js         | Frontend framework (SPA behavior)   |
| Tailwind CSS     | Fast, utility-first UI styling      |
| React Router     | Page routing (login → calendar)     |
| jQuery (optional)| Minor UI enhancements (if used)     |
| localStorage     | Persistent client-side data storage |
| React Hooks      | State & effect management           |
| Calendar Library | [`react-big-calendar`](https://github.com/jquense/react-big-calendar) or custom |

---

