import { Component, HostListener, NgZone, OnInit } from "@angular/core";
import { AnimationOptions } from "ngx-lottie";
import { AnimationItem } from "lottie-web";
import { IRules } from "../../../../core/interfaces/wumpus.interface";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-wumpus',
  templateUrl: './wumpus.cmponent.html',
  styleUrls: ['./wumpus.component.scss'],
})
export class WumpusComponent implements OnInit {

  title = 'Wumpus World';
  exitAlert = 'Salida';

  public map;
  public countArrow: number = 0;

  /** Variable que accede al archivo lottie del radar de wumpus */
  public optionsWumpus: AnimationOptions = {
    path: '/assets/lottie/radar.json',
  };

  /** Variable que accede al archivo lottie del radar de wumpus */
  public optionsExit: AnimationOptions = {
    path: '/assets/lottie/exit.json',
  };

  /** Variable que accede al archivo lottie de la brisa */
  public optionsBreeze: AnimationOptions = {
    path: '/assets/lottie/breeze.json',
  };

  /** Variable que accede al archivo lottie del hedor */
  public optionsStech: AnimationOptions = {
    path: '/assets/lottie/stench.json',
  };

  /** Variable que accede al archivo lottie del oro */
  public optionsGold: AnimationOptions = {
    path: '/assets/lottie/gold.json',
  };

  /** Variable que accede al archivo lottie de la flecha */
  public optionsArrow: AnimationOptions = {
    path: '/assets/lottie/arrow.json',
  };

  /** Control para la animacion del radar */
  private animationItemWumpusRadar?: AnimationItem;
  /** Control para la animacion del la brisa */
  private animationItemBreeze?: AnimationItem;
  /** Control para la animacion del olor */
  private animationItemStench?: AnimationItem;
  /** Control para la animacion de la salida */
  private animationItemExit?: AnimationItem;

  /** Bandera para saber si ya se encontro el oro */
  private selectGold: boolean = false;

  private params: { column: number, row: number, pit: number, arrow: number } = {
    column: 0,
    row: 0,
    pit: 0,
    arrow: 0
  };

  /** Flechas para el cazador */
  // public arrows: number;
  /** Pozos */
  // public pits: number;
  /** Reglas del juego */
  private rules: IRules[] = [];
  pressRight: boolean;
  pressDown: boolean;
  pressLeft: boolean;
  pressUp: boolean;

  constructor(private ngZone: NgZone, private readonly _activateRoute: ActivatedRoute) {
    this.pressRight = false;
    this.pressDown = false;
    this.pressUp = false;
    this.pressLeft = false;
  }

  ngOnInit(): void {

    this.params = {
      column: this._activateRoute.snapshot.params['column'],
      row: this._activateRoute.snapshot.params['row'],
      pit: this._activateRoute.snapshot.params['pit'],
      arrow: this._activateRoute.snapshot.params['arrow'],
    };

    this.createMap();
    this.loadTheWumpusOnTheMap();
    this.loadTheGoldOnTheMap();
    this.loadTheArrowOnTheMap();
    this.loadTheHunterOnTheMap();

    setTimeout(() => {
      this.stop('breeze');
      this.stop('radar');
    }, 700);
  }

  /**
   * Metodo que crea el mapa con las posiciones vacias.
   * @return void
   */
  createMap(): void {
    this.map = new Array(Number(this.params.column));
    for (var i = 0; i < this.map.length; i++) {
      this.map[i] = new Array(Number(this.params.row));
    }
    this.loadTheMap();
  }

  /**
   * Metodo que inicializa el mapa con las reglas del juego en cada posicion.
   * @return void
   */
  loadTheMap(): void {
    for (let column = 0; column < this.params.column; column++) {
      for (let row = 0; row < this.params.row; row++) {
        this.map[column][row] = {
          // Pozo
          pit: {
            exist: false,
            position: {
              column: 0,
              row: 0,
            },
          },
          // Oro
          gold: false,
          // Brisa
          breeze: false,
          // Hedor
          stench: false,
          // Wumpus
          wumpus: false,
          // Flecha
          arrow: false,
          // Cazador
          hunter: false,
          // Icono
          icon: {
            pit: 'fas fa-bullseye',
            gold: 'fas fa-light fa-coins',
            breeze: 'fas fa-water',
            stench: 'fas fa-wind',
            wumpus: 'fab fa-optin-monster',
            arrow: 'fas fa-thin fa-arrow-up-from-bracket',
            hunter: 'Icono sin definir, no encontre un fontAwesome que molara',
            exit: 'fa-sharp fa-solid fa-door-open'
          },
          exit: false
        };
      }
    }
    this.loadWellsOnTheMap();
  }

  /**
   * Metodo que agrega un pozo de forma aleatoria en una posicion de cada fila de la columna.
   * @return void
   */
  loadWellsOnTheMap(): void {
    for (let column = 0; column < Number(this.params.pit); column++) {
      const row = parseInt(String(Math.random() * this.map[column].length));
      this.map[column][row]['pit'] = {
        exist: true,
        position: {
          column,
          row,
        },
      };
    }

    this.addBreezeOnMap('Horizontal');
    this.addBreezeOnMap('Vertical');
  }

  /**
   * Metodo que agregar las brizas dependiendo de la ubicacion del pozo.
   * @param {string} orientation
   * @return void
   */
  addBreezeOnMap(orientation: string): void {
    if (orientation === 'Horizontal') {
      this.cellTourHorizontal('pit');
    } else {
      this.cellTourVertical('pit')
    }
  }

  /**
   * Metodo que carga un Cazador en el mapa.
   * @return void
   */
  loadTheHunterOnTheMap(): void {
    for (let column = 0; column < this.params.row; column++) {
      const row = parseInt(String(Math.random() * this.params.column));
      if (
        !this.map[row][column]['pit']['exist'] &&
        !this.map[row][column]['breeze'] &&
        !this.map[row][column]['stench'] &&
        !this.map[row][column]['gold'] &&
        !this.map[row][column]['arrow'] &&
        !this.map[row][column]['wumpus']
      ) {
        this.map[row][column]['hunter'] = true;
        this.map[row][column]['exit'] = true;
        break;
      } else {
        continue;
      }
    }
  }

  /**
   * Metodo que carga un Wumpus en el mapa.
   * @return void
   */
  loadTheWumpusOnTheMap(): void {
    for (let column = 0; column < this.params.row; column++) {
      const row = parseInt(String(Math.random() * this.params.column));
      if (!this.map[row][column]['pit']['exist'] && !this.map[row][column]['breeze']) {
        this.map[row][column]['wumpus'] = true;
        break;
      } else {
        continue;
      }
    }
    this.addStechOnWumpus('Horizontal');
    this.addStechOnWumpus('Vertical');
  }

  /**
   * Metodo que carga el oro en el mapa.
   * @return void
   */
  loadTheGoldOnTheMap(): void {
    for (let column = 0; column < this.params.column; column++) {
      const row = parseInt(String(Math.random() * this.params.column));
      if (!this.map[row][column]['pit']['exist'] && !this.map[row][column]['wumpus']) {
        this.map[row][column]['gold'] = true;
        break;
      } else {
        continue;
      }
    }
  }

  /**
   * Metodo que carga el oro en el mapa.
   * @return void
   */
  loadTheArrowOnTheMap(): void {
    for (let i = 0; i < 7; i++) {
      for (let column = 0; column < Number(this.params.arrow); column++) {
        const row = parseInt(String(Math.random() * this.params.column));
        if (
          !this.map[row][column]['pit']['exist'] &&
          !this.map[row][column]['wumpus']
        ) {
          this.map[row][column]['arrow'] = true;
          break;
        } else {
          continue;
        }
      }
    }
  }

  /**
   * Metodo que agregar las brizas dependiendo de la ubicacion del pozo.
   * @param {string} orientation
   * @return void
   */
  addStechOnWumpus(orientation: string): void {
    if (orientation === 'Horizontal') {
      this.cellTourHorizontal('wumpus');
    } else {
      this.cellTourVertical('wumpus');
    }
  }

  /**
   * Metodo que controla los movimientos del cazador hacia la derecha.
   * @return void
   */
  @HostListener('document:keydown.control.ArrowRight', ['$event'])
  hunterMovesRight(press: KeyboardEvent): void {
    this.searchHunter('Vertical', press.key);
  }

  /**
   * Metodo que controla los movimientos del cazador hacia la izquierda.
   * @return void
   */
  @HostListener('document:keydown.control.ArrowLeft', ['$event'])
  hunterMovesLeft(press: KeyboardEvent): void {
    this.searchHunter('Vertical.', press.key);
  }

  /**
   * Metodo que controla los movimientos del cazador hacia la arriba.
   * @return void
   */
  @HostListener('document:keydown.control.ArrowUp', ['$event'])
  hunterMovesUp(press: KeyboardEvent): void {
    this.searchHunter('Horizontal', press.key);
  }

  /**
   * Metodo que controla los movimientos del cazador hacia la abajo.
   * @return void
   */
  @HostListener('document:keydown.control.ArrowDown', ['$event'])
  hunterMovesDown(press: KeyboardEvent): void {
    this.searchHunter('Horizontal', press.key);
  }

  /**
   * Ubicar el cazador para poder desplazarlo.
   * @param {string} orientation
   * @param {string} key
   * @return void
   */
  searchHunter(orientation: string, key: string): void {
    if (orientation === 'Horizontal') {
      let pressSuccess = false;
      for (let column = 0; column < this.params.row; column++) {
        for (let row = 0; row < this.params.column; row++) {
          if (this.map[row][column]['hunter']) {
            switch (key) {
              case 'ArrowUp':
                this.keyMove(row, column, true, false, false, false, 'Horizontal');
                break;
              case 'ArrowDown':
                this.keyMove(row, column, false, true, false, false, 'Horizontal');
                break;
              default:
            }
            pressSuccess = true;
            break;
          }
        }
        if (pressSuccess) {
          break;
        }
      }
    } else {
      let pressSuccess = false;
      for (let column = 0; column < this.params.row; column++) {
        for (let row = 0; row < this.params.column; row++) {
          if (this.map[row][column]['hunter']) {
            switch (key) {
              case 'ArrowRight':
                this.keyMove(column, row, false, false, false, true, 'Vertical');
                break;
              case 'ArrowLeft':
                this.keyMove(column, row, false, false, true, false, 'Vertical');
                break;
              default:
            }
            pressSuccess = true;
            break;
          }
        }
        if (pressSuccess) {
          break;
        }
      }
    }
  }

  /**
   * Reglas del juego
   * @param {number} column
   * @param {number} row
   * @return void
   */
  execRules(column: number, row: number): void {

    if (this.map[column][row]['wumpus']) {
      this.warningAlert('Perdiste!', 'Encontraste al wumpus, adios luz que te guarde el cielo!');
    }

    if (this.map[column][row]['pit']['exist']) {
      this.warningAlert('Perdiste!', 'Caiste al pozo, estiraste la pata?');
    }

    if (this.map[column][row]['breeze']) {
      console.log('Sientes una brisa');
      this.play('breeze');
    } else {
      this.stop('breeze');
    }

    if (this.map[column][row]['stench']) {
      console.log('Sientes en un hedor');
      this.play('radar');
    } else {
      this.stop('radar');
    }

    if (this.map[column][row]['gold']) {
      this.selectGold = true;
    }

    if (this.map[column][row]['arrow']) {
      this.countArrow++;
      console.log('Encontrastes una flecha');
    }

    if(this.map[column][row]['exit'] && !this.selectGold) {
      this.exitAlert = 'Estas en la salida, pero te hace falta el oro!';
    }
    else if(this.map[column][row]['exit'] && this.selectGold) {
      this.messageSuccess('Winner!!', 'Encontraste el oro y regresaste a la salida, ganaste!!');
    } else {
      this.exitAlert = 'Salida';
    }
  }

  /**
   * Mensaje para notificaciones de advertencia
   * @param {string} title
   * @param {string} text
   * @return void
   */
  warningAlert(title: string, text: string): void {
    Swal.fire({
      title: `${title}`,
      text: `${text}`,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reset'
    }).then((result) => {
      location.reload();
    })
  }

  /**
   * Mensaje para notificaciones exitosas
   * @param {string} title
   * @param {string} text
   * @return void
   */
  messageSuccess(title: string, text: string): void {
    Swal.fire({
      title: `${title}`,
      text: `${text}`,
      icon: 'success', // Se usan dos metodos con el mismo codigo por que este parametro de la libreria no se deja usar con templates literales
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reset'
    }).then((result) => {
      location.reload();
    })
  }

  /**
   * Mensaje sencillo, para notificaciones
   * @param {string} title
   * @param {string} text
   * @return void
   */
  simpleNotificationWarning(title: string, text: string): void {
    Swal.fire(
      `${title}`,
      `${text}`,
      'warning'
    )
  }

  /**
   * Guardar animacion para administrarla.
   * @param {AnimationItem} animationItem
   * @param {string} type
   * @return void
   */
  animationCreated(animationItem: AnimationItem, type: string): void {
    if (type === 'radar') {
      this.animationItemWumpusRadar = animationItem;
    }
    if (type === 'breeze') {
      this.animationItemBreeze = animationItem;
    }
    if (type === 'stench') {
      this.animationItemStench = animationItem;
    }
    if (type === 'exit') {
      this.animationItemExit = animationItem;
    }
  }

  /**
   * Stop a la animacion lottie
   * @param {string} type
   * @return void
   */
  stop(type: string): void {
    this.ngZone.runOutsideAngular(() => {
      if (type === 'radar') {
        this.animationItemWumpusRadar?.stop();
      }
      if (type === 'breeze') {
        this.animationItemBreeze?.stop();
      }
      if (type === 'stench') {
        this.animationItemStench?.stop();
      }
      if (type === 'exit') {
        this.animationItemExit?.stop();
      }
    });
  }

  /**
   * Play a la animacion lottie
   * @param {string} type
   * @return void
   */
  play(type: string): void {
    this.ngZone.runOutsideAngular(() => {
      if (type === 'radar') {
        this.animationItemWumpusRadar?.play();
      }
      if (type === 'breeze') {
        this.animationItemBreeze?.play();
      }
      if (type === 'stench') {
        this.animationItemStench?.play();
      }
    });
  }

  /**
   * Metodo para pintar objetos en posicion horizontal
   * @param {number} row
   * @param {number} column
   * @param {string} property
   * @return void
   */
  paintObjectHorizontal(column: number, row: number, property: string) {
    switch (property) {
      case 'pit' :
        this.map[column][row]['breeze'] = true;
        this.map[column][row]['pit']['exist'] = false;
        break;
      case 'wumpus':
        this.map[column][row]['stench'] = true;
        this.map[column][row]['pit']['exist'] = false;
        break;
    }
  }


  /**
   * Metodo para pintar objetos en posicion vertical
   * @param {number} row
   * @param {number} column
   * @param {string} property
   * @return void
   */
  paintObjectVertical(row: number, column: number, property: string): void {
    switch (property) {
      case 'pit':
        this.map[row][column]['breeze'] = true;
        this.map[row][column]['pit']['exist'] = false;
        break;
      case 'wumpus':
        this.map[row][column]['stench'] = true;
        this.map[row][column]['pit']['exist'] = false;
        break;
    }
  }

  /**
   * Metodo para recorrer posicion horizontal.
   * @param {string} property
   * @return void
   */
  cellTourHorizontal(property: string): void {
    for (let column = 0; column < this.params.row; column++) {
      for (let row = 0; row < this.params.column; row++) {
        let condition = null;
        if (property === 'pit') {
          condition = this.map[row][column]['pit']['exist'];
        } else {
          condition = this.map[row][column][property];
        }
        if (condition) {
          try {
            const rowPos = row + 1;
            this.paintObjectHorizontal(rowPos, column, property);
          } catch (e) {
            console.error(`La posicion ${row + 1}, ${column} no existe`);
          }
          try {
            const rowPos = row - 1;
            this.paintObjectHorizontal(rowPos, column, property);
          } catch (e) {
            console.error(`La posicion ${row - 1}, ${column} no existe`);
          }
        }
      }
    }
  }

  /**
   * Metodo para recorrer en posicion vertical.
   * @param {string} property
   * @return void
   */
  cellTourVertical(property: string): void {
    for (let column = 0; column < this.params.column; column++) {
      for (let row = 0; row < this.params.row; row++) {
        let condition = null;
        if (property === 'pit') {
          condition = this.map[column][row]['pit']['exist'];
        } else {
          condition = this.map[column][row][property];
        }
        if (condition) {
          try {
            const rowPos = row + 1;
            this.paintObjectVertical(column, rowPos, property);
          } catch (e) {
            console.error(`La posicion ${column}, ${row + 1} no existe`);
          }
          try {
            const rowPos = row - 1;
            this.paintObjectVertical(column, rowPos, property);
          } catch (e) {
            3
            console.error(`La posicion ${column}, ${row - 1} no existe`);
          }
        }
      }
    }
  }

  /**
   * Metodo para los movimientos del cazador
   * @param {number} column
   * @param {number} row
   * @param {boolean} pressUp
   * @param {boolean} pressDown
   * @param {boolean} pressLeft
   * @param {boolean} pressRight
   * @param {boolean} type
   * @return void
   */
  keyMove(
    column: number,
    row: number,
    pressUp: boolean,
    pressDown: boolean,
    pressLeft: boolean,
    pressRight: boolean,
    type: string
  ): void {
    try {
      this.pressUp = pressUp;
      this.pressDown = pressDown;
      this.pressLeft = pressLeft;
      this.pressRight = pressRight;
      let rowPos = 0;
      let cell: any = null;
      if (type === 'Horizontal') {
        if (pressDown) {
          rowPos = row + 1;
        } else {
          rowPos = row - 1
        }
        this.execRules(column, rowPos);
        this.map[column][rowPos]['pit']['exist'] = false;
        this.map[column][rowPos]['breeze'] = false;
        this.map[column][rowPos]['stench'] = false;
        this.map[column][rowPos]['arrow'] = false;
        this.map[column][rowPos]['gold'] = false;
        this.map[column][rowPos]['wumpus'] = false;
        this.map[column][rowPos]['hunter'] = true;
        this.map[column][row]['hunter'] = false;
      } else {
        if (pressRight) {
          rowPos = row + 1;
        } else {
          rowPos = row - 1
        }
        this.execRules(rowPos, column);
        this.map[rowPos][column]['pit']['exist'] = false;
        this.map[rowPos][column]['breeze'] = false;
        this.map[rowPos][column]['stench'] = false;
        this.map[rowPos][column]['arrow'] = false;
        this.map[rowPos][column]['gold'] = false;
        this.map[rowPos][column]['wumpus'] = false;
        this.map[rowPos][column]['hunter'] = true;
        this.map[row][column]['hunter'] = false;
      }
    } catch (e) {
      console.error(`La posicion ${column}, ${row} no existe`);
    }
  }

  /**
   * Metodo para disparar las flechas.
   * @return void
   */
 shootArrow(): void {
    // Todo para matar al Wumpus se usaria la misma logica de caminar,
    //  simulando un paso, verificando en la posicion si existe el wumpus, si no existe
    //  usar una resta para mantener la posicion de tiro, si el wumpus si esta en la posicion
    //  notificar su muerte y posterior mensaje de victoria.
 }

}
