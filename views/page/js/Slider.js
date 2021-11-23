const SHOWING_CLASS = 'showing';
const firstSlide = document.querySelector('.slider__item:first-child');
//CSS의 선택자 -> slider__item의 첫째 자식요소


function slide() {
  const currentSlide = document.querySelector(`.${SHOWING_CLASS}`);
  //클래스명이 'showing'인 요소가 존재한다면 해당 요소를, 존재하지 않는다면 null을 반환한다.


  if(currentSlide) { //showing 클래스가 있다면 여기
    currentSlide.classList.remove('showing');
    //showing 클래스를 가지고 있는 요소에서 showing 클래스를 제거한다.


    const nextSlide = currentSlide.nextElementSibling;
    //기존에 showing 클래스를 가지고 있던 요소의 다음 형제 요소가 존재한다면 해당 요소를, 존재하지 않는다면 null을 반환한다.
    //showing을 가지고 있던 요소가 마지막 노드였다면 null을, 마지막 노드가 아니라면 기존 요소의 다음 형제 노드를 반환.


    if(nextSlide) { //다음 형제 노드가 존재하면 여기
      nextSlide.classList.add('showing');
      //그 노드에 showing 클래스를 추가한다.

    } else {  // 기존 노드가 마지막 노드여서 null을 반환했다면 여기
      firstSlide.classList.add('showing');
      //첫번째 형제 노드에 showing 클래스를 추가.
      //맨 마지막 이미지 다음에는 다시 첫번째 이미지로 돌아오는 방식.
    }

  } else { //showing 클래스가 없다면 여기
    //showing 클래스가 없다는 말은 곧 초기 상태(엘리먼트들이 처음 렌더링 되었을 때)를 의미함.

    firstSlide.classList.add('showing');
    //초기 상태에는 첫 번째 형제 노드에 showing 클래스를 추가.
  }
}
setInterval(slide, 1500);