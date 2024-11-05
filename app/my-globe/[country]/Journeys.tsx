import AddButton from '../../components/AddButton';
import HorizontalDivider from '../../components/HorizontalDivider';
import JourneyForm from './JourneyForm';

export default function Journeys() {
  return (
    <div className="text-center">
      <h2>Journeys</h2>
      <div className="flex items-center">
        <HorizontalDivider />
        <AddButton />
        <HorizontalDivider />
      </div>
      <div className="flex justify-center">
        <JourneyForm />
      </div>
    </div>
  );
}
