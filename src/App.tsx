import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Layout from "./web-structure/Layout";
import DashboardPage from "./pages/DashboardPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import EventPage from "./pages/EventPage";
import AddEventPage from "./pages/AddEventPage";
import AllAttendeePage from "./pages/AllAttendeePage";
import AllSponsorPage from "./pages/AllSponsorPage";
import ViewEventPage from "./pages/ViewEventPage";
import EditEventPage from "./pages/EditEventPage"
import LoginPage from "./pages/LoginPage";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AllEventAttendeePage from "./pages/AllEventAttendeePage";
import AddEventAttendeePage from './pages/AddEventAttendeePage';
import AllReports from "./pages/AllReports";
import WhatsAppReport from "./features/reports/component/WhatsAppReport";
import MailReport from "./features/reports/component/MailReport";
import AllCharts from "./pages/AllCharts";
import SendReminder from "./features/attendee/component/SendReminder";
import ViewAgendasPage from "./pages/ViewAgendasPage";
import AddAgendaPage from "./pages/AddAgendaPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PendingUserRequest from "./features/attendee/component/PendingUserRequest";
import SendInvitation from "./features/attendee/component/SendInvitation";
import SameDayReminder from "./features/attendee/component/SameDayReminder";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SessionReminder from "./features/attendee/component/SessionReminder";
import DayTwoReminder from "./features/attendee/component/DayTwoReminder";
import ChartsData from "./features/charts/ChartsData";
import AllPhotosPage from "./pages/AllPhotosPage";
import Photos from "./features/photos/Photos";
import SendMultipleMessage from "./features/attendee/component/SendMultipleMessage";
import SendToApp from "./features/attendee/component/SendToApp";
import SendPoll from "./features/attendee/component/SendPoll";
import ReminderBoothVisit from "./features/attendee/component/ReminderBoothVisit";
import DayTwoSameDayReminder from "./features/attendee/component/DayTwoSameDayReminder";
import ThankYouMessage from "./features/attendee/component/ThankYouMessage";
import EditAttendee from "./features/attendee/component/EditAttendee";
import EditAgenda from "./features/event/component/EditAgenda";
import SignupPage from "./pages/SignupPage";
import AllRequestedAttendee from "./features/attendee/component/AllRequestedAttendee";
import AddRequestedAttendee from "./features/attendee/component/AddRequestedAttendee";
import EditRequestedAttendee from "./features/attendee/component/EditRequestedAttendee";
import InviteResgistations from "./features/attendee/component/InviteResigtrations";
// import Photos from "./features/photos/photos";

axios.defaults.withCredentials = false;
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login page without Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* All other routes wrapped in Layout */}
        <Route
          element={<Layout />}
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/events/add-event" element={<AddEventPage />} />
          <Route path="/events/view-event/:uuid" element={<ViewEventPage />} />
          <Route path="/events/view-agendas/:uuid" element={<ViewAgendasPage />} />
          <Route path="/events/add-agenda/" element={<AddAgendaPage />} />
          <Route path="/events/edit-agenda/:agenda_uuid/:id" element={<EditAgenda />} />
          <Route path="/events/edit-event/:uuid" element={<EditEventPage />} />
          <Route path="/events/all-attendee/:uuid" element={<AllEventAttendeePage />} />
          <Route path="/events/all-requested-attendees/:uuid" element={<AllRequestedAttendee />} />
          {/* <Route path="/events/edit-attendee/:attendee_uuid/:id" element={<EditAttendee />} /> */}
          <Route path="/events/edit-attendee/:uuid/:attendee_uuid" element={<EditAttendee />} />
          <Route path="/events/edit-requested-attendee/:uuid/:attendee_uuid" element={<EditRequestedAttendee />} />
          <Route path="/events/pending-user-request/:uuid" element={<PendingUserRequest />} />
          <Route path="/events/send-to-app/:uuid" element={<SendToApp />} />
          <Route path="/events/add-attendee/:uuid" element={<AddEventAttendeePage />} />
          <Route path="/events/add-requested-attendee/:uuid" element={<AddRequestedAttendee />} />
          <Route path="/events/send-reminder/:uuid" element={<SendReminder />} />
          <Route path="/events/send-poll/:uuid" element={<SendPoll />} />
          <Route path="/events/invite-registrations/:uuid" element={<InviteResgistations />} />
          <Route path="/events/send-multiple-message/:uuid" element={<SendMultipleMessage />} />
          <Route path="/events/session-reminder/:uuid" element={<SessionReminder />} />
          <Route path="/events/day-two-reminder/:uuid" element={<DayTwoReminder />} />
          <Route path="/events/reminder-to-visit-booth/:uuid" element={<ReminderBoothVisit />} />
          <Route path="/events/day_two_same_day_reminder/:uuid" element={<DayTwoSameDayReminder />} />
          <Route path="/events/send-invitation" element={<SendInvitation />} />
          <Route path="/events/thank-you-message/:uuid" element={<ThankYouMessage />} />
          <Route path="/events/same-day-reminder/:uuid" element={<SameDayReminder />} />
          <Route path="/all-attendees" element={<AllAttendeePage />} />
          <Route path="/all-sponsors" element={<AllSponsorPage />} />
          <Route path="/all-reports" element={<AllReports />} />
          <Route path="/all-photos" element={<AllPhotosPage />} />
          <Route path="/all-photos/photo/:uuid" element={<Photos />} />
          <Route path="/all-charts" element={<AllCharts />} />
          <Route path="/all-charts/event-chart/:uuid" element={<ChartsData />} />
          <Route path="/all-reports/whatsapp-report/:uuid" element={<WhatsAppReport />} /> {/* Dynamic Route for WhatsApp Reports */}
          <Route path="/all-reports/mail-report/:uuid" element={<MailReport />} /> {/* Dynamic Route for WhatsApp Reports */}
        </Route>
      </Routes>

      <ToastContainer
        position="top-right" // Adjust position as needed
        autoClose={5000} // Duration for which toast is visible
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Newest toast on top
        closeOnClick // Close toast on click
        rtl={false} // Right to left
        pauseOnFocusLoss // Pause on focus loss
        draggable // Draggable
        pauseOnHover // Pause on hover
      />
    </Router>
  );
};

export default App;
