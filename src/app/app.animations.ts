/**********ANGULAR BROWSER ANIMATION REQUIREMENTS**********/
import { animate, 
         animation,
         state, 
         style, 
         transition, 
         trigger,
         useAnimation } from '@angular/animations';


const fadeInAnimation = animation([
    style({ opacity: 0 }),
    animate('225ms ease-out', style({ opacity: 1 }))
]);

const fadeOutAnimation = animation([
    style({ opacity: 1 }),
    animate('195ms ease-in', style({ opacity: 0 }))
]);

/*const scaleDownAnimation = animation([
    style('*'),
    animate(195, style({ transform: 'scale(.8)' }))
]);*/

/*const scaleUpAnimation = animation([
    style('*'),
    animate(195, style({ transform: 'scale(1)' }))
]);*/




/** APP ANIMATIONS */
export const fadeIn = trigger('fadeIn', [
    state('void', style({ opacity: 0 })),

    transition(':enter', useAnimation(fadeInAnimation))
]);

export const fadeOut = trigger('fadeOut', [
    state('void', style({ opacity: 0 })),

    transition(':leave', useAnimation(fadeOutAnimation))
]);

export const fade = trigger('fade', [
    state('void', style({ opacity: 0 })),

    transition(':enter', useAnimation(fadeInAnimation)),
    transition(':leave', useAnimation(fadeOutAnimation))
]);

export const slideFromLeft = trigger('slideFromLeft', [
    state('out', style('*')),
    state('in', style({ transform: 'translateX(50px)' })),
    
    transition('* <=> *', animate('195ms ease-in-out'))
]);

export const slideFromRight = trigger('slideFromRight', [
    state('out', style('*')),
    state('in', style({ transform: 'translateX(-50px)' })),
    
    transition('* <=> *', animate('195ms ease-in-out'))
]);

export const scale = trigger('scale', [
    state('large', style('*')),
    state('small', style({ transform : 'scale(.85)' })),
    
    transition(':enter', useAnimation(fadeInAnimation)),
    transition('* <=> *', animate('195ms ease-in-out')),
    transition(':leave', useAnimation(fadeOutAnimation))
]);