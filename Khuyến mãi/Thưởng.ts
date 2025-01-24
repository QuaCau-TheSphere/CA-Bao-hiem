export function tínhThưởng(phí: number, A: number) {
  if (phí >= 1.25e9) return mốc1250tr(phí, A);
  if (phí >= 250e6) return mốc250tr(phí, A);
  return mốcLẻ(phí);
}

function mốc1250tr(phí: number, A: number) {
  const phầnBội = Math.floor(phí / 1.25e9);
  const phầnDư = phí % 1.25e9;
  return phầnBội * A * 6 + mốc250tr(phầnDư, A);
}

function mốc250tr(phí: number, A: number) {
  const phầnBội = Math.floor(phí / 250e6);
  const phầnDư = phí % 250e6;
  return phầnBội * A + mốcLẻ(phầnDư);
}

function mốcLẻ(phí: number) {
  if (phí >= 200e6) return 4e6;
  if (phí >= 130e6) return 2e6;
  if (phí >= 80e6) return 5e5;
  if (phí >= 30e6) return 1e5;
  return 0;
}
