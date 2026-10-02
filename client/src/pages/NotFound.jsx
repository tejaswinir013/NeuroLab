import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card center">
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link className="btn primary" to="/">Go home</Link>
    </div>
  );
}