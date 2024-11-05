import AddButton from '../../components/AddButton';
import HorizontalDivider from '../../components/HorizontalDivider';

export default function Journeys() {
  return (
    <div className="text-center">
      <h2>Journeys</h2>
      <div className="flex items-center">
        <HorizontalDivider />
        <AddButton />
        <HorizontalDivider />
      </div>
    </div>
  );
}
