import { LoadingSize } from './types'
import { sLoadingXS, sLoadingS, sLoadingM } from './styles'

export const getSizeStyle = (size: LoadingSize) => {
    switch (size) {
        case 'xs':
            return sLoadingXS

        case 's':
            return sLoadingS

        case 'm':
            return sLoadingM
    }
}
