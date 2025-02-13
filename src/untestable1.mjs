const millisPerDay = 24 * 60 * 60 * 1000;

function daysUntilChristmasBad() {
  const now = new Date(); // Uses the current date and time so it's untestable
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Uses the current date so it's untestable
  const christmasDay = new Date(now.getFullYear(), 12 - 1, 25); // finds the next Christmas so it's untestable or you'd have to update it each year
  if (today.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(new Date().getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - today.getTime();
  return Math.floor(diffMillis / millisPerDay);
}

export function daysUntilChristmas(moment) {
  const today = new Date(moment.getFullYear(), moment.getMonth(), moment.getDate()); 
  const christmasDay = new Date(moment.getFullYear(), 12 - 1, 25); 
  if (today.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(new Date().getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - today.getTime();
  return Math.floor(diffMillis / millisPerDay);
}
