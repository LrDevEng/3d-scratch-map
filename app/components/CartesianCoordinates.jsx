import { Line } from '@react-three/drei';

export default function CartesianCoordinates({ hide = false }) {
  const axisStart = 0;
  const axisEnd = 4;
  const axisColorX = 'red';
  const axisColorY = 'blue';
  const axisColorZ = 'green';

  if (hide) {
    return undefined;
  }

  return (
    <mesh>
      <Line
        points={[
          [axisStart, 0, 0],
          [axisEnd, 0, 0],
        ]}
        segments
        color={axisColorX}
      />
      <Line
        points={[
          [0, axisStart, 0],
          [0, axisEnd, 0],
        ]}
        segments
        color={axisColorY}
      />
      <Line
        points={[
          [0, 0, axisStart],
          [0, 0, axisEnd],
        ]}
        segments
        color={axisColorZ}
      />
    </mesh>
  );
}
