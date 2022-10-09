// @ts-check

// import Example from './Example.js';

export default () => {
  const element = document.getElementById('point');
  // const obj = new Example(element);
  // obj.init();
  const div = document.createElement('div');
  div.innerHTML = `<form>
  <div class="mb-3 p-3">
    <label for="exampleFormControlTextarea1" class="form-label">Input your RSS-link here</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
    <button type="submit" class="btn btn-primary p-1 mt-3">Submit</button>
  </div>
</form>`;
  element?.append(div);
};
