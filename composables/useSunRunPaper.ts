import type GetSunRunPaperResponse from '~~/src/types/responseTypes/GetSunRunPaperResponse';

const useSunRunPaper = () =>
  usePersistedState<GetSunRunPaperResponse | null>('sunRunPaperState', 'totoro:sunrun-paper', () => null);

export default useSunRunPaper;
