import { type Journey } from '../../../migrations/00002-createTableJourneys';
import AddButton from '../../components/AddButton';
import HorizontalDivider from '../../components/HorizontalDivider';
import JourneyForm from './JourneyForm';

type Props = {
  journeys: Journey[];
};

export default function Journeys({ journeys }: Props) {
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
      {journeys.map((journey) => {
        return (
          <div key={`journey-${journey.id}`}>
            <div>{journey.title}</div>
            <div>{journey.dateStart.toDateString()}</div>
            <div>{journey.dateEnd.toDateString()}</div>
            <div>{journey.summary}</div>
          </div>
        );
      })}
    </div>
  );
}
