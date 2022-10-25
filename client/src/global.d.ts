declare module "*.scss" {
    const content: { [className: string]: string };
    export = content;
  }
 // 출처: https://whales.tistory.com/101 [허도경, limewhale:티스토리]

 declare module "*.module.css";




 // *.module.css 를 import 하여 사용 하려면 위처럼 모듈 타입을 설정해야한다 .
 // module.css 는 className의 중복을 막기위해 사용된다. 
 