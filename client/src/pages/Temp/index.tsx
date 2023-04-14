import AnalogGuage from "../../components/Device/AnalogGuage";


function TempPage() {

  let LL = 150;
  let L = 190;
  let Set = 230;
  let H = 270;
  let HH = 300;
  let Max = 300;
  let Val = 240;
  let Label = "V2"
  let gaugeOptions = {
    LL, L, Set, H, HH, Max,Val, Label
  };
  
  return (
    <>
    <div className="home">
        Temp Page
        <AnalogGuage gaugeOptions = {gaugeOptions} />
      </div>
      </>
  )
}
export default TempPage;