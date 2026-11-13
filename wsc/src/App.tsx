import CrayonDefs from './components/CrayonDefs';
import LogoLoader from './components/LogoLoader';
import CrayonTrail from './components/CrayonTrail';
import Lab from './Lab';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CrayonDefs />
      <Lab />
      <CrayonTrail />
      <LogoLoader />
    </>
  );
}
