import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Project Information</h1>
      <div className="space-y-4">
        <p>
          Welcome to the Simple Task Planner project. This application is
          designed to help you manage your tasks efficiently using the
          Eisenhower Matrix method and various other productivity tools.
        </p>

        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Eisenhower Matrix for task prioritization</li>
          <li>Kanban board for visual task management</li>
          <li>Project-based task organization</li>
          <li>Pomodoro timer for focused work sessions</li>
          <li>Picture-in-Picture (PiP) mode for the Pomodoro timer</li>
          <li>Task filtering by project</li>
          <li>Completed tasks management</li>
          <li>Customizable Kanban columns</li>
          <li>Drag-and-drop task management</li>
          <li>Estimated and completed Pomodoros tracking</li>
          <li>Deadline setting and tracking</li>
          <li>Dark mode support</li>
        </ul>

        <h2 className="text-2xl font-semibold">Data Storage</h2>
        <p>
          All data in this application is stored locally in your browser&apos;s local
          storage. We do not collect or store any of your personal information
          or task data on our servers.
        </p>

        <h2 className="text-2xl font-semibold">Privacy</h2>
        <p>
          Since all data is stored locally, your information remains private and
          is not accessible to us or any third parties.
        </p>

        <h2 className="text-2xl font-semibold">Data Persistence</h2>
        <p>
          Please note that clearing your browser&apos;s local storage or cache will
          result in the loss of all your task data. We recommend regularly
          backing up your important information.
        </p>

        <h2 className="text-2xl font-semibold">No Warranty or Guarantee</h2>
        <p>
          This application is provided &lsquo;as is&rsquo; without any warranties or
          guarantees. We are not responsible for any data loss or issues that
          may occur while using this application.
        </p>

        <h2 className="text-2xl font-semibold">Open Source</h2>
        <p>
          This project is open source. You can view the source code, contribute,
          or report issues on our GitHub repository.
        </p>

        <h2 className="text-2xl font-semibold">Contribute and Report Issues</h2>
        <p>
          We welcome contributions to this project! If you encounter any issues
          or have feature requests, please create a ticket on our GitHub
          repository. You can also contribute by submitting pull requests or
          improving documentation.
        </p>
        <p>
          GitHub Repository:{" "}
          <a
            href="https://github.com/bnap00/task-planner"
            className="text-blue-500 hover:underline"
            target="_blank"
          >
            https://github.com/bnap00/task-planner
          </a>
        </p>

        <h2 className="text-2xl font-semibold">User-First Development</h2>
        <p>
          This project follows the guidelines outlined by{" "}
          <a
            href="https://userfirst.dev"
            className="text-blue-500 hover:underline"
            target="_blank"
          >
            userfirst.dev
          </a>
          , ensuring that our development process prioritizes user needs and
          experiences.
        </p>
      </div>
      <div className="mt-8">
        <Link href="/" passHref>
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
