import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { isToday, format, parseISO, isAfter, isBefore } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import DayPicker, { DayModifiers }  from "react-day-picker";
import "react-day-picker/lib/style.css";


import { FiClock, FiPower } from "react-icons/fi";
import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Appointment,
    Calendar
} from "./styles";

import logo from "../../assets/logo.svg";

import { useAuth } from "../../hooks/auth";
import api from "../../services/api";

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
  }

var user_id: '1ff6cbf0-0123-43f4-8620-83cfeb16bd10';
var user_name: 'Manager PDV';


interface Appointments {
    id: string;
    date: string;
    hourFormatted: string;
    user: {
      name: string;
      avatar_url: string;
    };
  }

const Public: React.FC = () => {
    const { signOut } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const [appointments, setAppointments] = useState<Appointments[]>([]);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available && !modifiers.disabled) {
          setSelectedDate(day);
        }
      }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api
          .get(`/providers/${user_id}/month-availability`, {
            params: {
              year: currentMonth.getFullYear(),
              month: currentMonth.getMonth() + 1,
            },
          })
          .then(response => {
            setMonthAvailability(response.data);
          });
      }, [currentMonth]);

    useEffect(() => {
        api
          .get<Appointments[]>("/appointments/me", {
            params: {
              year: selectedDate.getFullYear(),
              month: selectedDate.getMonth() + 1,
              day: selectedDate.getDate(),
            },
          })
          .then(response => {
            const appointmentsFormatted = response.data.map(appointment => {
                return {
                  ...appointment,
                  hourFormatted: format(parseISO(appointment.date), "HH:mm"),
                };
              });
            setAppointments(appointmentsFormatted);
          });
      }, [selectedDate]);

      const disabledDays = useMemo(() => {
        const dates = monthAvailability
          .filter(monthDay => monthDay.available === false)
          .map(monthDay => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();

            return new Date(year, month, monthDay.day);
          });

        return dates;
      }, [currentMonth, monthAvailability]);

      const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
          locale: ptBR,
        });
      }, [selectedDate]);

      const selectedWeekDay = useMemo(() => {
        return format(selectedDate, "cccc", {
          locale: ptBR,
        });
      }, [selectedDate]);

      const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
          return parseISO(appointment.date).getHours() < 12;
        });
      }, [appointments]);

      const afternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => {
          return parseISO(appointment.date).getHours() >= 12;
        });
      }, [appointments]);

      const nextAppointment = useMemo(() => {
        return appointments.find(appointment =>
          isAfter(parseISO(appointment.date), new Date()),
        );
      }, [appointments]);

    return(
    <Container>
        <Header>
         <HeaderContent>
          <img src={logo} alt="Classist" />

          <Profile>
            <img src={'https://app-classist-test.s3.amazonaws.com/020b90e1d564de3fd9b5-sistema-pdv-integrado-com-ifood-fgf-manager-erp.jpeg'} alt={'Manager PDV'} />

            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user_name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
            <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
                <strong>Manhã</strong>
                {isToday(selectedDate) && (
                <p>Nenhum horário disponível</p>
            )}

                {isBefore(selectedDate, new Date()) && (
                <p>Nenhum horário disponível</p>
            )}

                {morningAppointments.length === 0 && !isToday(selectedDate) && !isBefore(selectedDate, new Date()) && (
           <><a href={"https://fgfinfo.com.br/website/abrir-chamado/?data-solicitada=" + selectedDateAsText + "_9hr"}><p><span>9:00 hrs</span></p>
            </a><a href={"https://fgfinfo.com.br/website/abrir-chamado/?data-solicitada=" + selectedDateAsText + "_10hr"}><p><span>10:00 hrs</span></p></a>
            <a href={"https://fgfinfo.com.br/website/abrir-chamado/?data-solicitada=" + selectedDateAsText + "_11hr"}><p><span>11:00 hrs</span></p></a>
           </>
            )}


                {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
                <strong>Tarde</strong>

                <strong>Manhã</strong>
                {isToday(selectedDate) && (
                <p>Nenhum horário disponível</p>
            )}

{isBefore(selectedDate, new Date()) && (
                <p>Nenhum horário disponível</p>
            )}

                {morningAppointments.length === 0 && !isToday(selectedDate) && !isBefore(selectedDate, new Date()) && (
           <><a href={"https://fgfinfo.com.br/website/abrir-chamado/?data-solicitada=" + selectedDateAsText + "_14hr"}><p><span>14:00 hrs</span></p>
            </a><a href={"https://fgfinfo.com.br/website/abrir-chamado/?data-solicitada=" + selectedDateAsText + "_16hr"}><p><span>16:00 hrs</span></p></a>
            <a href={"https://fgfinfo.com.br/website/abrir-chamado/?data-solicitada=" + selectedDateAsText + "_17hr"}><p><span>17:00 hrs</span></p></a>
           </>
            )}

                {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

        </Schedule>

            <Calendar>
                <DayPicker
                    weekdaysShort={["D", "S", "T", "Q", "Q", "S", "S"]}
                    fromMonth={new Date()}
                    disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                    modifiers={{
                        available: { daysOfWeek: [1, 2, 3, 4, 5] },
                      }}
                    onMonthChange={handleMonthChange}
                    selectedDays={selectedDate}
                    onDayClick={handleDateChange}
                    months={[
                        "Janeiro",
                        "Fevereiro",
                        "Março",
                        "Abril",
                        "Maio",
                        "Junho",
                        "Julho",
                        "Agosto",
                        "Setembro",
                        "Outubro",
                        "Novembro",
                        "Dezembro",
                      ]}

                />
            </Calendar>
      </Content>

    </Container>
);
};

export default Public;

